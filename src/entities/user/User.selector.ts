import type { User } from '../../types/index';

export const getSkillsCanTeach = (user: User): string[] => {
	return Array.isArray(user.skillCanTeach)
		? user.skillCanTeach.map((s) => s.skill)
		: [user.skillCanTeach.skill];
};

export const getSkillsWantToLearn = (user: User): string[] => {
	return user.subcategoriesWantToLearn.map((s) => s.skill);
};
