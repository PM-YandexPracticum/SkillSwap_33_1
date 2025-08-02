import userData from '../../../public/db/user.json';

export const DEFAULT_AVATAR =
	'/assets/images/profile-pictures/avatar-default.svg';

interface LocalUser {
	id?: number;
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
	skillsCanTeach?: string[];
	skillsWantToLearn?: string[];
}

// Вспомогательная функция для безопасного парсинга даты
export const parseDate = (dateString: string): Date | null => {
	if (!dateString || typeof dateString !== 'string') return null;

	const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
	if (!dateRegex.test(dateString)) return null;

	const date = new Date(dateString);
	return isNaN(date.getTime()) ? null : date;
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
		return JSON.parse(raw) as LocalUser;
	} catch {
		return null;
	}
};

export const useUser = () => {
	const stored = getLocalUser();
	const user: LocalUser =
		stored || (Array.isArray(userData) ? userData[0] : userData);
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
	};
};
