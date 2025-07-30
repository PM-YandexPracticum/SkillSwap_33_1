import userData from '../../../public/db/user.json';

export const DEFAULT_AVATAR =
	'/assets/images/profile-pictures/avatar-default.svg';

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

	return {
		id: user.id,
		name: user.name,
		email: user.email,
		password: user.password,
		avatarUrl: getSafeAvatarUrl(user.avatarUrl),
		birthDate: user.birthDate,
		genderId: user.genderId,
		locationId: user.locationId,
		description: user.description,
		createdAt: user.createdAt,
		skillsCanTeach: user.skillsCanTeach || [],
		skillsWantToLearn: user.skillsWantToLearn || [],
	};
};
