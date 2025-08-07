// API для работы с заявками на обмен навыками (localStorage)

import { LOCAL_STORAGE_PATHS } from '@/shared/constants/local_storage_paths';
import { getCurrentUser, type AuthUser } from '@/features/auth/AuthForm.model';
import { SkillsAPI } from './skills.api';

export interface ExchangeRequest {
	id: string;
	fromUserId: string; // инициатор
	toUserId: string; // получатель
	skillOfferedSubcategory: number; // навык, который отдаёт инициатор
	skillRequestedSubcategory: number; // навык, который просит инициатор
	status: 'pending' | 'inProgress' | 'rejected' | 'done';
	createdAt: string;
	completedAt?: string;
}

function readStorage(): ExchangeRequest[] {
	if (typeof window === 'undefined') return [];
	try {
		const raw = window.localStorage.getItem(
			LOCAL_STORAGE_PATHS.exchangeRequests
		);
		return raw ? (JSON.parse(raw) as ExchangeRequest[]) : [];
	} catch {
		return [];
	}
}

function writeStorage(list: ExchangeRequest[]) {
	if (typeof window === 'undefined') return;
	window.localStorage.setItem(
		LOCAL_STORAGE_PATHS.exchangeRequests,
		JSON.stringify(list)
	);
}

function getUserSkills(userId: string) {
	const users = JSON.parse(
		localStorage.getItem('auth_users') || '[]'
	) as AuthUser[];
	const auth = users.find((u) => `usr_${u.id}` === userId);
	if (auth) {
		return {
			teach: auth.canTeachSubcategories || [],
			learn: auth.wantToLearnSubcategories || [],
		};
	}
	const tempCards = JSON.parse(localStorage.getItem('temp_user_cards') || '[]');
	const card = tempCards.find((c: any) => c.id === userId);
	if (card) {
		return {
			teach: (card.skillsCanTeach || []).map((s: any) => s.subcategoryId),
			learn: card.skillsWantToLearn || [],
		};
	}
	const dbUsers = JSON.parse(localStorage.getItem('db_users_cache') || '[]');
	const dbUser = dbUsers.find((u: any) => u.id === userId);
	return {
		teach: (dbUser?.skillsCanTeach || []).map((s: any) => s.subcategoryId),
		learn: dbUser?.skillsWantToLearn || [],
	};
}

export function findMutualSkills(
	targetUserId: string,
	requestedSkillId: number
): { offered: number; requested: number } | null {
	const currentUser = getCurrentUser();
	const currentUserId = currentUser?.id ? `usr_${currentUser.id}` : null;
	if (!currentUserId) return null;

	const me = getUserSkills(currentUserId);
	const target = getUserSkills(String(targetUserId));

	if (
		!me.learn.includes(requestedSkillId) ||
		!target.teach.includes(requestedSkillId)
	) {
		return null;
	}

	const offered = target.learn.find((id: number) => me.teach.includes(id));
	if (offered === undefined) return null;

	return { offered, requested: requestedSkillId };
}

export function findMutualMatches(): Array<{
	userId: string;
	offered: number;
	requested: number;
}> {
	const currentUser = getCurrentUser();
	const currentUserId = currentUser?.id ? `usr_${currentUser.id}` : null;
	if (!currentUserId) return [];

	const me = getUserSkills(currentUserId);
	const authUsers = JSON.parse(
		localStorage.getItem('auth_users') || '[]'
	) as AuthUser[];
	const tempCards = JSON.parse(localStorage.getItem('temp_user_cards') || '[]');
	const dbUsers = JSON.parse(localStorage.getItem('db_users_cache') || '[]');
	const allIds = [
		...authUsers.map((u) => `usr_${u.id}`),
		...tempCards.map((c: any) => c.id),
		...dbUsers.map((u: any) => u.id),
	].filter((id) => id !== currentUserId);

	const matches: Array<{ userId: string; offered: number; requested: number }> =
		[];
	allIds.forEach((id) => {
		const other = getUserSkills(id);
		const offeredList = other.learn.filter((s: number) => me.teach.includes(s));
		const requestedList = other.teach.filter((s: number) =>
			me.learn.includes(s)
		);
		if (offeredList.length > 0 && requestedList.length > 0) {
			matches.push({
				userId: id,
				offered: offeredList[0],
				requested: requestedList[0],
			});
		}
	});

	return matches;
}

export function getSentRequests(): string[] {
	const currentUser = getCurrentUser();
	const currentUserId = currentUser?.id ? `usr_${currentUser.id}` : null;
	if (!currentUserId) return [];
	return readStorage()
		.filter((r) => r.fromUserId === currentUserId && r.status === 'pending')
		.map((r) => r.toUserId);
}

export function createExchangeRequest(
	targetUserId: string,
	skillOffered: number,
	skillRequested: number
): void {
	const currentUser = getCurrentUser();
	const currentUserId = currentUser?.id ? `usr_${currentUser.id}` : null;
	if (!currentUserId) return;

	const requests = readStorage();
	const exists = requests.some(
		(r) =>
			r.fromUserId === currentUserId &&
			r.toUserId === String(targetUserId) &&
			r.status === 'pending'
	);
	if (exists) return;

	const req: ExchangeRequest = {
		id: crypto.randomUUID(),
		fromUserId: currentUserId,
		toUserId: String(targetUserId),
		skillOfferedSubcategory: skillOffered,
		skillRequestedSubcategory: skillRequested,
		status: 'pending',
		createdAt: new Date().toISOString(),
	};
	requests.push(req);
	writeStorage(requests);
}

export function getReceivedRequests(): string[] {
	const currentUser = getCurrentUser();
	const currentUserId = currentUser?.id ? `usr_${currentUser.id}` : null;
	if (!currentUserId) return [];
	return readStorage()
		.filter((r) => r.toUserId === currentUserId && r.status === 'pending')
		.map((r) => r.fromUserId);
}

export function hasInProgressExchange(targetUserId: string): boolean {
	const currentUser = getCurrentUser();
	const currentUserId = currentUser?.id ? `usr_${currentUser.id}` : null;
	if (!currentUserId) return false;
	return readStorage().some(
		(r) =>
			r.status === 'inProgress' &&
			((r.fromUserId === currentUserId &&
				r.toUserId === String(targetUserId)) ||
				(r.toUserId === currentUserId && r.fromUserId === String(targetUserId)))
	);
}

export function updateRequestStatus(
	fromUserId: string,
	toUserId: string,
	status: 'inProgress' | 'rejected'
): void {
	const requests = readStorage();
	const req = requests.find(
		(r) =>
			r.fromUserId === String(fromUserId) &&
			r.toUserId === String(toUserId) &&
			r.status === 'pending'
	);
	if (req) {
		req.status = status;
		writeStorage(requests);
	}
}

export function finishExchange(requestId: string): void {
	const requests = readStorage();
	const req = requests.find(
		(r) => r.id === requestId && r.status === 'inProgress'
	);
	if (!req) return;

	req.status = 'done';
	req.completedAt = new Date().toISOString();
	writeStorage(requests);

	try {
		const users = JSON.parse(
			localStorage.getItem('auth_users') || '[]'
		) as AuthUser[];
		const userA = users.find((u) => `usr_${u.id}` === req.fromUserId);
		const userB = users.find((u) => `usr_${u.id}` === req.toUserId);
		const tempCards = JSON.parse(
			localStorage.getItem('temp_user_cards') || '[]'
		);
		const cardA = tempCards.find((c: any) => c.id === req.fromUserId);
		const cardB = tempCards.find((c: any) => c.id === req.toUserId);

		const getSkillData = (
			owner: AuthUser | undefined | { skillsCanTeach?: any[] },
			subId: number
		) => {
			if (!owner) return { description: '', images: [] as string[] };
			if ('skillDescriptionsBySubcategory' in owner) {
				const desc = owner.skillDescriptionsBySubcategory?.[subId] || '';
				const imgs = owner.skillImagesBySubcategory?.[subId] || [];
				return { description: desc, images: imgs };
			}
			const skill = owner.skillsCanTeach?.find(
				(s: {
					subcategoryId: number;
					description?: string;
					images?: string[];
				}) => s.subcategoryId === subId
			);
			return {
				description: skill?.description || '',
				images: skill?.images || [],
			};
		};

		if (userA) {
			userA.wantToLearnSubcategories = (
				userA.wantToLearnSubcategories || []
			).filter((id) => id !== req.skillRequestedSubcategory);
			userA.canTeachSubcategories = userA.canTeachSubcategories || [];
			if (
				!userA.canTeachSubcategories.includes(req.skillRequestedSubcategory)
			) {
				userA.canTeachSubcategories.push(req.skillRequestedSubcategory);
			}
			const { description, images } = getSkillData(
				userB || cardB,
				req.skillRequestedSubcategory
			);
			userA.skillDescriptionsBySubcategory =
				userA.skillDescriptionsBySubcategory || {};
			userA.skillImagesBySubcategory = userA.skillImagesBySubcategory || {};
			userA.skillDescriptionsBySubcategory[req.skillRequestedSubcategory] =
				description;
			userA.skillImagesBySubcategory[req.skillRequestedSubcategory] = images;
		}

		if (userB) {
			userB.wantToLearnSubcategories = (
				userB.wantToLearnSubcategories || []
			).filter((id) => id !== req.skillOfferedSubcategory);
			userB.canTeachSubcategories = userB.canTeachSubcategories || [];
			if (!userB.canTeachSubcategories.includes(req.skillOfferedSubcategory)) {
				userB.canTeachSubcategories.push(req.skillOfferedSubcategory);
			}
			const { description, images } = getSkillData(
				userA || cardA,
				req.skillOfferedSubcategory
			);
			userB.skillDescriptionsBySubcategory =
				userB.skillDescriptionsBySubcategory || {};
			userB.skillImagesBySubcategory = userB.skillImagesBySubcategory || {};
			userB.skillDescriptionsBySubcategory[req.skillOfferedSubcategory] =
				description;
			userB.skillImagesBySubcategory[req.skillOfferedSubcategory] = images;
		}

		if (userA || userB) {
			localStorage.setItem('auth_users', JSON.stringify(users));
		}

		if (cardA) {
			cardA.skillsWantToLearn = (cardA.skillsWantToLearn || []).filter(
				(id: number) => id !== req.skillRequestedSubcategory
			);
			cardA.skillsCanTeach = cardA.skillsCanTeach || [];
			const existing = cardA.skillsCanTeach.find(
				(s: any) => s.subcategoryId === req.skillRequestedSubcategory
			);
			const data = getSkillData(userB || cardB, req.skillRequestedSubcategory);
			if (existing) {
				existing.description = data.description;
				existing.images = data.images;
			} else {
				cardA.skillsCanTeach.push({
					subcategoryId: req.skillRequestedSubcategory,
					description: data.description,
					images: data.images,
				});
			}
		}

		if (cardB) {
			cardB.skillsWantToLearn = (cardB.skillsWantToLearn || []).filter(
				(id: number) => id !== req.skillOfferedSubcategory
			);
			cardB.skillsCanTeach = cardB.skillsCanTeach || [];
			const existing = cardB.skillsCanTeach.find(
				(s: any) => s.subcategoryId === req.skillOfferedSubcategory
			);
			const data = getSkillData(userA || cardA, req.skillOfferedSubcategory);
			if (existing) {
				existing.description = data.description;
				existing.images = data.images;
			} else {
				cardB.skillsCanTeach.push({
					subcategoryId: req.skillOfferedSubcategory,
					description: data.description,
					images: data.images,
				});
			}
		}

		if (cardA || cardB) {
			localStorage.setItem('temp_user_cards', JSON.stringify(tempCards));
		}

		SkillsAPI.clearCache();
	} catch {
		// no-op
	}
}

export function getUserRequests(): ExchangeRequest[] {
	const currentUser = getCurrentUser();
	const currentUserId = currentUser?.id ? `usr_${currentUser.id}` : null;
	if (!currentUserId) return [];
	return readStorage().filter(
		(r) => r.fromUserId === currentUserId || r.toUserId === currentUserId
	);
}
