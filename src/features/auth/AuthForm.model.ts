import { useState } from 'react';

export interface AuthUser {
	id?: number;
	email: string;
	password: string;
	fullName?: string;
	birthDate?: string;
	gender?: string;
	city?: string;
	skillCategory?: string;
	skillSubcategory?: string;
	skillName?: string;
	description?: string;
	avatarUrl?: string;
}

export const USERS_KEY = 'users';
export const SESSION_KEY = 'currentUser';

const getStoredUsers = (): AuthUser[] => {
	if (typeof window === 'undefined') return [];
	const raw = window.localStorage.getItem(USERS_KEY);
	if (!raw) return [];
	try {
		return JSON.parse(raw) as AuthUser[];
	} catch {
		return [];
	}
};

const saveUsers = (users: AuthUser[]) => {
	if (typeof window !== 'undefined') {
		window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
	}
};

const getSessionUser = (): AuthUser | null => {
	if (typeof window === 'undefined') return null;
	const raw = window.localStorage.getItem(SESSION_KEY);
	if (!raw) return null;
	try {
		return JSON.parse(raw) as AuthUser;
	} catch {
		return null;
	}
};

export const useAuth = () => {
	const [user, setUser] = useState<AuthUser | null>(() => getSessionUser());

	const login = (email: string, password: string): boolean => {
		const users = getStoredUsers();
		const found = users.find(
			(u) => u.email === email && u.password === password
		);
		if (found) {
			if (typeof window !== 'undefined') {
				window.localStorage.setItem(SESSION_KEY, JSON.stringify(found));
			}
			setUser(found);
			return true;
		}
		return false;
	};

	const register = (data: AuthUser): void => {
		const users = getStoredUsers();
		const newUser = { ...data, id: Date.now() };
		users.push(newUser);
		saveUsers(users);
		if (typeof window !== 'undefined') {
			window.localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
		}
		setUser(newUser);
	};

	const logout = (): void => {
		if (typeof window !== 'undefined') {
			window.localStorage.removeItem(SESSION_KEY);
		}
		setUser(null);
	};

	const isAuthenticated =
		typeof window !== 'undefined' &&
		Boolean(window.localStorage.getItem(SESSION_KEY));

	return { user, isAuthenticated, login, register, logout } as const;
};

export const getCurrentUser = (): AuthUser | null => getSessionUser();
