import { useState } from 'react';
import { getAvatar, setAvatar } from '@/shared/lib/avatarStorage';

export interface AuthUser {
	id?: string;
	email: string;
	password: string;
	fullName?: string;
	birthDate?: string;
	gender?: string;
	genderId?: string;
	city?: string;
	locationId?: string;
	wantToLearnCategories?: number[];
	wantToLearnSubcategories?: number[];
	canTeachCategories?: number[];
	canTeachSubcategories?: number[];
	skillsCanTeach?: Array<{
		subcategoryId: number;
		description: string;
		images: string[];
	}>;
	skillsWantToLearn?: number[];
	skillImagesBySubcategory?: Record<number, string[]>;
	skillDescriptionsBySubcategory?: Record<number, string>;
	skillName?: string;
	description?: string;
	avatarUrl?: string;
	files?: FileList | null;
}

export const USERS_KEY = 'auth_users';
export const SESSION_KEY = 'currentUser';

export const getStoredUsers = (): AuthUser[] => {
	if (typeof window === 'undefined') return [];
	const raw = window.localStorage.getItem(USERS_KEY);
	if (!raw) return [];
	try {
		const users: AuthUser[] = JSON.parse(raw) as AuthUser[];
		let migrated = false;
		const enriched = users.map((u) => {
			const { avatarUrl, ...rest } = u;
			if (avatarUrl && rest.id) {
				void setAvatar(String(rest.id), avatarUrl);
				migrated = true;
			}
			return {
				...rest,
				avatarUrl: rest.id
					? getAvatar(String(rest.id)) || undefined
					: undefined,
			};
		});
		if (migrated) {
			const sanitized = users.map(({ avatarUrl: _avatarUrl, ...rest }) => rest);
			window.localStorage.setItem(USERS_KEY, JSON.stringify(sanitized));
		}
		return enriched;
	} catch {
		return [];
	}
};

export const saveUsers = (users: AuthUser[]) => {
	if (typeof window !== 'undefined') {
		const sanitized = users.map((u) => {
			const { avatarUrl, ...rest } = u;
			if (avatarUrl && rest.id) {
				void setAvatar(String(rest.id), avatarUrl);
			}
			return rest;
		});
		window.localStorage.setItem(USERS_KEY, JSON.stringify(sanitized));
	}
};

export const saveSession = (sessionUser: AuthUser) => {
	if (typeof window !== 'undefined') {
		const { avatarUrl, ...rest } = sessionUser;
		if (avatarUrl && rest.id) {
			void setAvatar(String(rest.id), avatarUrl);
		}
		window.localStorage.setItem(SESSION_KEY, JSON.stringify(rest));
		window.dispatchEvent(new Event('userUpdated'));
	}
};

const getSessionUser = (): AuthUser | null => {
	if (typeof window === 'undefined') return null;
	const raw = window.localStorage.getItem(SESSION_KEY);
	if (!raw) return null;
	try {
		const user: AuthUser = JSON.parse(raw) as AuthUser;
		if (user.avatarUrl && user.id) {
			void setAvatar(String(user.id), user.avatarUrl);
			delete user.avatarUrl;
			window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
		}
		const avatar = user.id
			? getAvatar(String(user.id)) || undefined
			: undefined;
		return { ...user, avatarUrl: avatar };
	} catch {
		return null;
	}
};

// Вспомогательная функция для создания карточки с изображениями
const createUserCardWithImages = (
	userData: AuthUser,
	skillImages: string[]
): void => {
	try {
		// Создаем объект пользователя в формате users.json
		const avatar =
			getAvatar(String(userData.id)) ||
			'/db/profile-pictures/avatar-default.svg';
		const userCard = {
			id: `usr_${userData.id}`,
			name: userData.fullName || 'Пользователь',
			avatarUrl: avatar,
			birthDate: userData.birthDate || '1990-01-01',
			genderId: userData.gender || 'unspecified',
			locationId: userData.city || 'city1',
			description: userData.description || 'Новый пользователь SkillSwap',
			createdAt: new Date().toISOString(),
			skillsCanTeach:
				userData.canTeachSubcategories?.map((subcategoryId) => ({
					subcategoryId,
					description:
						userData.skillDescriptionsBySubcategory?.[subcategoryId] ||
						userData.description ||
						'Описание навыка',
					images: skillImages,
				})) || [],
			skillsWantToLearn: userData.wantToLearnSubcategories || [],
		};

		// Сохраняем в localStorage как временное решение
		const existingCards = JSON.parse(
			localStorage.getItem('temp_user_cards') || '[]'
		);
		existingCards.push(userCard);
		localStorage.setItem('temp_user_cards', JSON.stringify(existingCards));

		// persist images and descriptions to auth_users entry
		const storedUsers = getStoredUsers();
		const idx = storedUsers.findIndex((u) => u.id === userData.id);
		if (idx !== -1) {
			const u = storedUsers[idx];
			u.skillImagesBySubcategory = u.skillImagesBySubcategory || {};
			u.skillDescriptionsBySubcategory = u.skillDescriptionsBySubcategory || {};
			userData.canTeachSubcategories?.forEach((subcategoryId) => {
				(u.skillImagesBySubcategory as Record<number, string[]>)[
					subcategoryId
				] = skillImages;
				(u.skillDescriptionsBySubcategory as Record<number, string>)[
					subcategoryId
				] =
					userData.skillDescriptionsBySubcategory?.[subcategoryId] ||
					userData.description ||
					'';
			});
			storedUsers[idx] = u;
			saveUsers(storedUsers);
		}

		// Очищаем кэш API для обновления списка пользователей
		if (typeof window !== 'undefined' && (window as any).SkillsAPI) {
			(window as any).SkillsAPI.clearCache();
		}

		console.log('Создана карточка пользователя:', userCard);
	} catch (error) {
		console.error('Ошибка при создании карточки пользователя:', error);
	}
};

// Сжимает изображение и возвращает dataURL с уменьшенным размером
const compressImage = (file: File): Promise<string> => {
	return new Promise((resolve) => {
		const reader = new FileReader();
		reader.onloadend = () => {
			const img = new Image();
			img.onload = () => {
				const canvas = document.createElement('canvas');
				const MAX_SIZE = 800;
				let { width, height } = img;
				if (width > height && width > MAX_SIZE) {
					height = (height * MAX_SIZE) / width;
					width = MAX_SIZE;
				} else if (height > MAX_SIZE) {
					width = (width * MAX_SIZE) / height;
					height = MAX_SIZE;
				}
				canvas.width = width;
				canvas.height = height;
				const ctx = canvas.getContext('2d');
				ctx?.drawImage(img, 0, 0, width, height);
				resolve(canvas.toDataURL('image/jpeg', 0.7));
			};
			img.src = reader.result as string;
		};
		reader.readAsDataURL(file);
	});
};

// Функция для создания карточки пользователя в формате users.json
export const createUserCard = async (initialData: AuthUser): Promise<void> => {
	try {
		const user = { ...initialData };
		user.skillDescriptionsBySubcategory =
			user.skillDescriptionsBySubcategory || {};
		user.canTeachSubcategories?.forEach((subcategoryId) => {
			if (!user.skillDescriptionsBySubcategory?.[subcategoryId]) {
				(user.skillDescriptionsBySubcategory as Record<number, string>)[
					subcategoryId
				] = user.description || '';
			}
		});

		// Обрабатываем загруженные изображения
		let skillImages: string[] = [];

		if (user.files && user.files.length > 0) {
			const filePromises = Array.from(user.files).map((file: File) =>
				compressImage(file)
			);
			skillImages = await Promise.all(filePromises);
			createUserCardWithImages(user, skillImages);
		} else {
			skillImages = [
				'https://i.ibb.co/rGKcmVB7/matheus-farias-Tf-F9it7bidc-unsplash.jpg',
				'https://i.ibb.co/zhXFPnYY/ashe-walker-91st-Dm-TERL4-unsplash.jpg',
				'https://i.ibb.co/fGQ1SC5s/mathilde-langevin-s-Z-WM4c-Ol-M-unsplash.jpg',
			];
			createUserCardWithImages(user, skillImages);
		}
	} catch (error) {
		console.error('Ошибка при создании карточки пользователя:', error);
	}
};

// Функция для очистки временных карточек
export const clearTempUserCards = (): void => {
	if (typeof window !== 'undefined') {
		localStorage.removeItem('temp_user_cards');
		// Очищаем кэш API
		if ((window as any).SkillsAPI) {
			(window as any).SkillsAPI.clearCache();
		}
		console.log('Временные карточки пользователей очищены');
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

	const register = async (
		data: AuthUser
	): Promise<{ success: boolean; userId?: string }> => {
		const users = getStoredUsers();
		if (users.some((u) => u.email === data.email)) {
			return { success: false };
		}
		const userId = Date.now().toString();
		const newUser: AuthUser = { ...data, id: userId };
		if ('skillName' in newUser) {
			delete (newUser as any).skillName;
		}
		if (newUser.avatarUrl) {
			await setAvatar(userId, newUser.avatarUrl);
			delete newUser.avatarUrl;
		}
		users.push(newUser);
		saveUsers(users);
		persistSession({ ...newUser, avatarUrl: getAvatar(userId) || undefined });

		// Создаем карточку пользователя и дожидаемся сохранения изображений
		await createUserCard(newUser);

		return { success: true, userId };
	};

	const logout = (): void => {
		if (typeof window !== 'undefined') {
			// Удаляем данные сессии
			window.localStorage.removeItem(SESSION_KEY);
			// Очищаем временные карточки пользователей
			clearTempUserCards();
			// Уведомляем об изменении пользователя
			window.dispatchEvent(new Event('userUpdated'));
		}
		setUser(null);
	};

	const isAuthenticated =
		typeof window !== 'undefined' &&
		Boolean(window.localStorage.getItem(SESSION_KEY));

	return { user, isAuthenticated, login, register, logout } as const;
};

export const getCurrentUser = (): AuthUser | null => getSessionUser();

export const updateUser = async (updatedUser: AuthUser): Promise<void> => {
	const users = getStoredUsers();
	const index = users.findIndex((u) => String(u.id) === String(updatedUser.id));
	if (updatedUser.avatarUrl && updatedUser.id) {
		await setAvatar(String(updatedUser.id), updatedUser.avatarUrl);
	}
	const sanitized = { ...updatedUser };
	delete sanitized.avatarUrl;
	let merged = sanitized;
	if (index !== -1) {
		const existing = users[index];
		merged = { ...existing } as AuthUser;
		Object.entries(sanitized).forEach(([key, value]) => {
			if (value !== undefined) {
				(merged as any)[key] = value;
			}
		});
		users[index] = merged;
		saveUsers(users);
	}
	saveSession({
		...merged,
		avatarUrl: getAvatar(String(updatedUser.id)) || undefined,
	});
	if (typeof window !== 'undefined' && (window as any).SkillsAPI) {
		(window as any).SkillsAPI.clearCache();
	}
};
