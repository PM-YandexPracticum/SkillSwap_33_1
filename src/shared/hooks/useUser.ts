import userData from '../../../public/db/user.json';
import type { User, UserSkill } from '@/types';

const DEFAULT_AVATAR = '/src/shared/assets/icons/user.svg';

export const useUser = () => {
	const user = userData as User;

	const normalizeSkills = (skills: UserSkill | UserSkill[]): UserSkill[] => {
		return Array.isArray(skills) ? skills : [skills];
	};

	return {
		id: user.id,
		name: user.name,
		email: user.email,
		location: user.location,
		gender: user.gender,
		age: user.age,
		description: user.description,
		avatarUrl: user.avatarUrl?.trim() || DEFAULT_AVATAR,
		skillsCanTeach: normalizeSkills(user.skillCanTeach),
		skillsToLearn: user.subcategoriesWantToLearn,
		images: user.images || [],
	};
};
