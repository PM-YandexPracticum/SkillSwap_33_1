import { useEffect, useState } from 'react';
import userData from '../../../public/db/user.json';
import { getAvatar } from '@/shared/lib/avatarStorage';

export const DEFAULT_AVATAR =
	'/assets/images/profile-pictures/avatar-default.svg';

interface LocalUser {
	id?: string;
	name?: string;
	fullName?: string;
	email: string;
	password: string;
	avatarUrl?: string;
	birthDate?: string;
	gender?: string;
	genderId?: string;
	city?: string;
	locationId?: string;
	description?: string;
	createdAt?: string;
	skillsCanTeach?: Array<{
		subcategoryId: number;
		description: string;
		images: string[];
	}>;
	skillsWantToLearn?: number[];
	wantToLearnCategories?: number[];
	wantToLearnSubcategories?: number[];
	canTeachCategories?: number[];
	canTeachSubcategories?: number[];
}

// Вспомогательная функция для безопасного парсинга даты
export const parseDate = (dateString: string): Date | null => {
	if (!dateString || typeof dateString !== 'string') return null;

	const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
	if (!dateRegex.test(dateString)) return null;

	const [year, month, day] = dateString.split('-').map(Number);
	const date = new Date(year, month - 1, day);
	return isNaN(date.getTime()) ? null : date;
};

export const formatDate = (date: Date | null): string => {
	if (!date) return '';
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};

// Функция для безопасного получения URL аватара
export const getSafeAvatarUrl = (url?: string): string => {
	if (!url?.trim()) return DEFAULT_AVATAR;
	try {
		new URL(url);
		return url;
	} catch {
		return DEFAULT_AVATAR;
	}
};

// Функция для обработки ошибки загрузки аватара
export const handleAvatarError = (
	e: React.SyntheticEvent<HTMLImageElement>
) => {
	const target = e.currentTarget;
	target.onerror = null;
	target.src = DEFAULT_AVATAR;
};

const getLocalUser = (): LocalUser | null => {
	if (typeof window === 'undefined') return null;
	const raw = window.localStorage.getItem('currentUser');
	if (!raw) return null;
	try {
		const parsed = JSON.parse(raw) as LocalUser;
		if (parsed.id) {
			const avatar = getAvatar(String(parsed.id));
			if (avatar) {
				parsed.avatarUrl = avatar;
			}
		}
		return parsed;
	} catch {
		return null;
	}
};

const defaultUser: LocalUser = Array.isArray(userData)
	? userData[0]
	: (userData as LocalUser);

export const useUser = () => {
	const [user, setUser] = useState<LocalUser>(
		() => getLocalUser() || defaultUser
	);

	useEffect(() => {
		const handleChange = () => {
			setUser(getLocalUser() || defaultUser);
		};

		window.addEventListener('userUpdated', handleChange);
		window.addEventListener('storage', handleChange);

		return () => {
			window.removeEventListener('userUpdated', handleChange);
			window.removeEventListener('storage', handleChange);
		};
	}, []);

	const safeBirthDate = parseDate(user.birthDate || '');

	return {
		id: user.id,
		name: user.fullName || user.name,
		email: user.email,
		password: user.password,
		avatarUrl: getSafeAvatarUrl(user.avatarUrl),
		birthDate: safeBirthDate,
		genderId: user.gender || user.genderId,
		locationId: user.city || user.locationId,
		description: user.description,
		createdAt: user.createdAt,
		skillsCanTeach: user.skillsCanTeach || [],
		skillsWantToLearn: user.skillsWantToLearn || [],
		wantToLearnCategories: user.wantToLearnCategories || [],
		wantToLearnSubcategories: user.wantToLearnSubcategories || [],
		canTeachCategories: user.canTeachCategories || [],
		canTeachSubcategories: user.canTeachSubcategories || [],
	};
};
