import userData from '../../../public/db/user.json';

export const DEFAULT_AVATAR =
	'/assets/images/profile-pictures/avatar-default.svg';

// Вспомогательная функция для безопасного парсинга даты
const parseDate = (dateString: string): Date | null => {
	if (!dateString || typeof dateString !== 'string') return null;

	// Проверяем соответствие формату YYYY-MM-DD
	const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
	if (!dateRegex.test(dateString)) return null;

	const date = new Date(dateString);
	// Проверяем, что дата валидна (например, не "2024-99-99")
	return isNaN(date.getTime()) ? null : date;
};

export const useUser = () => {
	const user = Array.isArray(userData) ? userData[0] : userData;

	const getSafeAvatarUrl = (url?: string) => {
		if (!url?.trim()) return DEFAULT_AVATAR;
		try {
			new URL(url);
			return url;
		} catch {
			return DEFAULT_AVATAR;
		}
	};

	const safeBirthDate = parseDate(user.birthDate);

	return {
		id: user.id,
		name: user.name,
		email: user.email,
		password: user.password,
		avatarUrl: getSafeAvatarUrl(user.avatarUrl),
		birthDate: safeBirthDate, // уже объект Date или null
		genderId: user.genderId,
		locationId: user.locationId,
		description: user.description,
		createdAt: user.createdAt,
		skillsCanTeach: user.skillsCanTeach || [],
		skillsWantToLearn: user.skillsWantToLearn || [],
	};
};
