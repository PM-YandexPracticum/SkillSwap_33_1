import { useState } from 'react';

export interface AuthUser {
	id?: string;
	email: string;
	password: string;
	fullName?: string;
	birthDate?: string;
	gender?: string;
	city?: string;
	wantToLearnCategories?: number[];
	wantToLearnSubcategories?: number[];
	canTeachCategories?: number[];
	canTeachSubcategories?: number[];
	skillName?: string;
	description?: string;
	avatarUrl?: string;
}

export const USERS_KEY = 'users';
export const SESSION_KEY = 'currentUser';

export const getStoredUsers = (): AuthUser[] => {
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

export const saveSession = (sessionUser: AuthUser) => {
	if (typeof window !== 'undefined') {
		window.localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
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

	const persistSession = (sessionUser: AuthUser) => {
		saveSession(sessionUser);
		setUser(sessionUser);
	};

	const login = (email: string, password: string): boolean => {
		const users = getStoredUsers();
		const found = users.find(
			(u) => u.email === email && u.password === password
		);
		if (found) {
			persistSession(found);
			return true;
		}
		return false;
	};

	const register = (data: AuthUser): boolean => {
		const users = getStoredUsers();
		if (users.some((u) => u.email === data.email)) {
			return false;
		}
		const newUser = { ...data, id: Date.now().toString() };
		users.push(newUser);
		saveUsers(users);
		persistSession(newUser);
		return true;
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

export const updateUser = (updatedUser: AuthUser): void => {
	const users = getStoredUsers();
	const index = users.findIndex((u) => String(u.id) === String(updatedUser.id));
	if (index !== -1) {
		users[index] = updatedUser;
		saveUsers(users);
	}
	saveSession(updatedUser);
};
