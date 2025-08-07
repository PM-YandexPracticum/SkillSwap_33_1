import type { UserCardData } from '@/entities/user/user';
import type { SkillCategory, City } from '@/entities/skill/skill';
import {
        getSentRequests,
        getReceivedRequests,
        findMutualMatches,
} from './requests.api';
import { getCurrentUser } from '@/features/auth/AuthForm.model';
import { LOCAL_STORAGE_PATHS } from '@/shared/constants/local_storage_paths';
import { getAvatar } from '@/shared/lib/avatarStorage';

interface UserData {
	id: string;
	name: string;
	avatarUrl: string;
	birthDate: string;
	genderId: string;
	locationId: string;
	description: string;
	createdAt: string;
	skillsCanTeach: Array<{
		subcategoryId: number;
		description: string;
		images: string[];
	}>;
	skillsWantToLearn: number[];
}

interface CitiesData {
	cities: City[];
}

interface LikeData {
	userId: string;
	targetUserId: string;
	createdAt: string;
}

interface RequestData {
	id: string;
	skillId: number;
	fromUserId: string;
	toUserId: string;
	statusId: number;
	createdAt: string;
	finishedAt: string | null;
}

export class SkillsAPI {
	private static cachedUsers:
		| Omit<UserCardData, 'isExchangeSent' | 'hasReceivedRequest'>[]
		| null = null;

	static async getUsers(): Promise<UserCardData[]> {
		const sentRequests = getSentRequests();
		const receivedRequests = getReceivedRequests();
		const mutual = findMutualMatches();
		const mutualIds = new Set(mutual.map((m) => m.userId));

		const current = getCurrentUser();
		let favoriteIds: string[] = [];
		if (current) {
			const store = JSON.parse(
				localStorage.getItem(LOCAL_STORAGE_PATHS.favoriteUsers) || '{}'
			);
			favoriteIds = store[`usr_${current.id}`] || [];
		}

		if (this.cachedUsers) {
			return this.cachedUsers.map((u) => ({
				...u,
				isFavorite: favoriteIds.includes(u.id),
				isExchangeSent: sentRequests.includes(u.id),
				hasReceivedRequest: receivedRequests.includes(u.id),
				hasMutualMatch: mutualIds.has(u.id),
			}));
		}

		try {
			const usersResponse = await fetch('/db/users.json');
			const usersData: UserData[] = await usersResponse.json();

			// Получаем временные карточки из localStorage
			const tempCards = JSON.parse(
				localStorage.getItem('temp_user_cards') || '[]'
			);
			const authUsers = JSON.parse(
				localStorage.getItem('auth_users') || '[]'
			).map((u: any) => ({
				id: `usr_${u.id}`,
				name: u.fullName || 'Пользователь',
                                avatarUrl:
                                        getAvatar(String(u.id)) ||
                                        '/db/profile-pictures/avatar-default.svg',
				birthDate: u.birthDate || '1990-01-01',
				genderId: u.gender || 'unspecified',
				locationId: u.city || 'city1',
				description: u.description || 'Новый пользователь SkillSwap',
				createdAt: new Date().toISOString(),
				skillsCanTeach: (u.canTeachSubcategories || []).map((id: number) => ({
					subcategoryId: id,
					description:
						(u.skillDescriptionsBySubcategory &&
							u.skillDescriptionsBySubcategory[id]) ||
						'',
					images:
						(u.skillImagesBySubcategory && u.skillImagesBySubcategory[id]) ||
						[],
				})),
				skillsWantToLearn: u.wantToLearnSubcategories || [],
			}));

			const userMap = new Map<string, UserData>();
			[...usersData, ...tempCards, ...authUsers].forEach((u) => {
				userMap.set(u.id, u);
			});
			const allUsersData = Array.from(userMap.values());

			const skillsResponse = await fetch('/db/skills.json');
			const skillsData: SkillCategory[] = await skillsResponse.json();

			const citiesResponse = await fetch('/db/city.json');
			const citiesData: CitiesData = await citiesResponse.json();

			this.cachedUsers = allUsersData.map((user) => {
				const city = citiesData.cities.find((c) => c.id === user.locationId);

				const birthDate = new Date(user.birthDate);
				const today = new Date();
				const age = today.getFullYear() - birthDate.getFullYear();

				const gender =
					user.genderId === 'male'
						? 'Мужской'
						: user.genderId === 'female'
							? 'Женский'
							: 'Не указан';

				const canTeachSkills = user.skillsCanTeach.map(
					(skill: { subcategoryId: number }) => {
						const category = skillsData.find((cat) =>
							cat.skills.some((s) => s.id === skill.subcategoryId)
						);
						const skillName = category?.skills.find(
							(s) => s.id === skill.subcategoryId
						);
						return skillName?.name || 'Неизвестный навык';
					}
				);

				const wantToLearnSkills = user.skillsWantToLearn.map(
					(skillId: number) => {
						const category = skillsData.find((cat) =>
							cat.skills.some((s) => s.id === skillId)
						);
						const skillName = category?.skills.find((s) => s.id === skillId);
						return skillName?.name || 'Неизвестный навык';
					}
				);

                                const avatar =
                                        getAvatar(user.id.replace('usr_', '')) ||
                                        user.avatarUrl;
                                const normalizedAvatar = avatar?.replace(/^\/public/, '') ||
                                        '/db/profile-pictures/avatar-default.svg';
                                return {
                                        id: user.id,
                                        name: user.name,
                                        avatarUrl: normalizedAvatar,
                                        location: city?.['city-name'] || 'Неизвестный город',
                                        age,
                                        gender,
                                        description: user.description,
                                        skillsCanTeach: canTeachSkills,
                                        skillsWantToLearn: wantToLearnSkills,
                                        isFavorite: favoriteIds.includes(user.id),
                                        createdAt: user.createdAt,
                                };
                        });

			return this.cachedUsers.map((u) => ({
				...u,
				isFavorite: favoriteIds.includes(u.id),
				isExchangeSent: sentRequests.includes(u.id),
				hasReceivedRequest: receivedRequests.includes(u.id),
				hasMutualMatch: mutualIds.has(u.id),
			}));
		} catch (error) {
			console.error('Ошибка при загрузке пользователей:', error);
			return [];
		}
	}

	/**
	 * Получить данные конкретного пользователя по ID, включая описание и изображения
	 */
	static async getOfferById(userId: string) {
		try {
			const usersResponse = await fetch('/db/users.json');
			const usersData: UserData[] = await usersResponse.json();

			// Получаем временные карточки из localStorage
			const tempCards = JSON.parse(
				localStorage.getItem('temp_user_cards') || '[]'
			);
			const authUsers = JSON.parse(
				localStorage.getItem('auth_users') || '[]'
			).map((u: any) => ({
				id: `usr_${u.id}`,
				name: u.fullName || 'Пользователь',
                                avatarUrl:
                                        getAvatar(String(u.id)) ||
                                        '/db/profile-pictures/avatar-default.svg',
				birthDate: u.birthDate || '1990-01-01',
				genderId: u.gender || 'unspecified',
				locationId: u.city || 'city1',
				description: u.description || 'Новый пользователь SkillSwap',
				createdAt: new Date().toISOString(),
				skillsCanTeach: (u.canTeachSubcategories || []).map((id: number) => ({
					subcategoryId: id,
					description:
						(u.skillDescriptionsBySubcategory &&
							u.skillDescriptionsBySubcategory[id]) ||
						'',
					images:
						(u.skillImagesBySubcategory && u.skillImagesBySubcategory[id]) ||
						[],
				})),
				skillsWantToLearn: u.wantToLearnSubcategories || [],
			}));

			// Объединяем данные и убираем дубликаты, чтобы обновлённая
			// информация из auth_users имела приоритет
			const userMap = new Map<string, any>();
			[...usersData, ...tempCards, ...authUsers].forEach((u) => {
				userMap.set(u.id, u);
			});

			const skillsResponse = await fetch('/db/skills.json');
			const skillsData: SkillCategory[] = await skillsResponse.json();

			const user = userMap.get(userId);
			if (!user) return null;

			const skillMap = new Map<number, { name: string; category: string }>(
				skillsData.flatMap((category) =>
					category.skills.map((skill) => [
						skill.id,
						{ name: skill.name, category: category.name },
					])
				)
			);

			const skillsCanTeach = user.skillsCanTeach.map(
				(skill: {
					subcategoryId: number;
					description: string;
					images: string[];
				}) => {
					const skillEntry = skillMap.get(skill.subcategoryId);

					return {
						subcategoryId: skill.subcategoryId,
						title: skillEntry?.name || 'Неизвестный навык',
						category: skillEntry?.category || 'Неизвестная категория',
						description: skill.description,
						images: skill.images,
					};
				}
			);

			return {
				id: user.id,
				description: user.description,
				skillsCanTeach,
			};
		} catch (error) {
			console.error(`Ошибка при загрузке пользователя с id ${userId}:`, error);
			return null;
		}
	}

	static async getPopularUsers(): Promise<UserCardData[]> {
		try {
			const users = await this.getUsers();

			const likesResponse = await fetch('/db/likes.json');
			const likesData: LikeData[] = await likesResponse.json();

			const userLikes = likesData.reduce(
				(acc, like) => {
					const targetUserId = like.targetUserId;
					return {
						...acc,
						[targetUserId]: (acc[targetUserId] || 0) + 1,
					};
				},
				{} as Record<string, number>
			);

			users.sort((a, b) => (userLikes[b.id] || 0) - (userLikes[a.id] || 0));

			return users.slice(0, 3);
		} catch (error) {
			console.error('Ошибка при загрузке популярных пользователей:', error);

			const users = await this.getUsers();
			return users.slice(0, 3);
		}
	}

	static async getNewUsers(): Promise<UserCardData[]> {
		try {
			const users = await this.getUsers();

			users.sort((a, b) => {
				const dateA = new Date(a.createdAt || '');
				const dateB = new Date(b.createdAt || '');
				return dateB.getTime() - dateA.getTime();
			});

			return users.slice(0, 3);
		} catch (error) {
			console.error('Ошибка при загрузке новых пользователей:', error);

			const users = await this.getUsers();
			return users.slice(-3);
		}
	}

	static async getRecommendedUsers(params?: {
		offset?: number;
		limit?: number;
	}): Promise<UserCardData[]> {
		const { offset = 0, limit = 20 } = params || {};

		try {
			const users = await this.getUsers();

			const requestsResponse = await fetch('/db/requests.json');
			const requestsData: RequestData[] = await requestsResponse.json();

			const userExchanges = requestsData
				.filter((req) => req.statusId === 4 && req.finishedAt)
				.reduce(
					(acc, req) => ({
						...acc,
						[req.toUserId]: (acc[req.toUserId] || 0) + 1,
					}),
					{} as Record<string, number>
				);

			const sortedUsers = [...users].sort(
				(a, b) => (userExchanges[b.id] || 0) - (userExchanges[a.id] || 0)
			);

			return sortedUsers.slice(offset, offset + limit);
		} catch (error) {
			console.error('Ошибка при загрузке:', error);
			const users = await this.getUsers();
			const shuffled = [...users].sort(() => 0.5 - Math.random());
			return shuffled.slice(offset, offset + limit);
		}
	}

	static async getSkillCategories(): Promise<SkillCategory[]> {
		try {
			const response = await fetch('/db/skills.json');
			return await response.json();
		} catch (error) {
			console.error('Ошибка при загрузке категорий навыков:', error);
			return [];
		}
	}

	static async getCities(): Promise<City[]> {
		try {
			const response = await fetch('/db/city.json');
			const data: CitiesData = await response.json();
			return data.cities;
		} catch (error) {
			console.error('Ошибка при загрузке городов:', error);
			return [];
		}
	}

	static clearCache() {
		this.cachedUsers = null;
	}
}

// Экспортируем в глобальную область для доступа к clearCache
if (typeof window !== 'undefined') {
	(window as any).SkillsAPI = SkillsAPI;
}
