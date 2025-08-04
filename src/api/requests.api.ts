// API для работы с заявками на обмен навыками (localStorage)

import { LOCAL_STORAGE_PATHS } from '@/shared/constants/local_storage_paths';
import { getCurrentUser } from '@/features/auth/AuthForm.model';

type ExchangeMap = Record<string, string[]>;

function readStorage(): ExchangeMap {
	if (typeof window === 'undefined') return {};
	try {
		const raw = window.localStorage.getItem(
			LOCAL_STORAGE_PATHS.exchangeRequests
		);
		return raw ? (JSON.parse(raw) as ExchangeMap) : {};
	} catch {
		return {};
	}
}

function writeStorage(map: ExchangeMap) {
	if (typeof window === 'undefined') return;
	window.localStorage.setItem(
		LOCAL_STORAGE_PATHS.exchangeRequests,
		JSON.stringify(map)
	);
}

export function getSentRequests(): string[] {
	const currentUser = getCurrentUser();
	if (!currentUser?.id) return [];
	const map = readStorage();
	return map[String(currentUser.id)] || [];
}

export function addSentRequest(targetUserId: string): void {
	const currentUser = getCurrentUser();
	if (!currentUser?.id) return;
	const map = readStorage();
	const userId = String(currentUser.id);
	const set = new Set(map[userId] || []);
	set.add(String(targetUserId));
	map[userId] = Array.from(set);
	writeStorage(map);
}
