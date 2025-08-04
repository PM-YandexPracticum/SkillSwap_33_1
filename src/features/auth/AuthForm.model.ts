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
	files?: FileList | null;
}

export const USERS_KEY = 'auth_users';
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
		window.dispatchEvent(new Event('userUpdated'));
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

// Вспомогательная функция для создания карточки с изображениями
const createUserCardWithImages = (
	userData: AuthUser,
	skillImages: string[]
): void => {
	try {
		// Создаем объект пользователя в формате users.json
		const userCard = {
			id: `usr_${userData.id}`,
			name: userData.fullName || 'Пользователь',
			avatarUrl:
				userData.avatarUrl || '/public/db/profile-pictures/avatar-default.svg',
			birthDate: userData.birthDate || '1990-01-01',
			genderId: userData.gender || 'unspecified',
			locationId: userData.city || 'city1',
			description: userData.description || 'Новый пользователь SkillSwap',
			createdAt: new Date().toISOString(),
			skillsCanTeach:
				userData.canTeachSubcategories?.map((subcategoryId) => ({
					subcategoryId,
					description: userData.description || 'Описание навыка',
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

		// Очищаем кэш API для обновления списка пользователей
		if (typeof window !== 'undefined' && (window as any).SkillsAPI) {
			(window as any).SkillsAPI.clearCache();
		}

		console.log('Создана карточка пользователя:', userCard);
	} catch (error) {
		console.error('Ошибка при создании карточки пользователя:', error);
	}
};

// Функция для создания карточки пользователя в формате users.json
export const createUserCard = (userData: AuthUser): void => {
	try {
		// Обрабатываем загруженные изображения
		let skillImages: string[] = [];

		if (userData.files && userData.files.length > 0) {
			// Конвертируем FileList в массив base64 строк
			const filePromises = Array.from(userData.files).map((file: File) => {
				return new Promise<string>((resolve) => {
					const reader = new FileReader();
					reader.onloadend = () => {
						resolve(reader.result as string);
					};
					reader.readAsDataURL(file);
				});
			});

			// Ждем завершения всех чтений файлов
			Promise.all(filePromises).then((images) => {
				skillImages = images;
				createUserCardWithImages(userData, skillImages);
			});
		} else {
			// Если файлы не загружены, используем дефолтные изображения
			skillImages = [
				'https://i.ibb.co/rGKcmVB7/matheus-farias-Tf-F9it7bidc-unsplash.jpg',
				'https://i.ibb.co/zhXFPnYY/ashe-walker-91st-Dm-TERL4-unsplash.jpg',
				'https://i.ibb.co/fGQ1SC5s/mathilde-langevin-s-Z-WM4c-Ol-M-unsplash.jpg',
			];
			createUserCardWithImages(userData, skillImages);
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

	const register = (data: AuthUser): { success: boolean; userId?: string } => {
		const users = getStoredUsers();
		if (users.some((u) => u.email === data.email)) {
			return { success: false };
		}
		const userId = Date.now().toString();
		const newUser = { ...data, id: userId };
		users.push(newUser);
		saveUsers(users);
		persistSession(newUser);

		// Создаем карточку пользователя
		createUserCard(newUser);

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

export const updateUser = (updatedUser: AuthUser): void => {
	const users = getStoredUsers();
	const index = users.findIndex((u) => String(u.id) === String(updatedUser.id));
	if (index !== -1) {
		users[index] = updatedUser;
		saveUsers(users);
	}
	saveSession(updatedUser);
};
