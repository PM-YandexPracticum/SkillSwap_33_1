import userData from '../../../public/db/user.json';

const DEFAULT_AVATAR = '/src/shared/assets/icons/user.svg';

export const useUser = () => {
	// userData теперь массив, берём первого пользователя для примера
	const user = Array.isArray(userData) ? userData[0] : userData;

	return {
		id: user.id,
		name: user.name,
		email: user.email,
		password: user.password,
		avatarUrl: user.avatarUrl?.trim() || DEFAULT_AVATAR,
		birthDate: user.birthDate,
		genderId: user.genderId,
		locationId: user.locationId,
		description: user.description,
		createdAt: user.createdAt,
		skillsCanTeach: user.skillsCanTeach || [],
		skillsWantToLearn: user.skillsWantToLearn || [],
	};
};
