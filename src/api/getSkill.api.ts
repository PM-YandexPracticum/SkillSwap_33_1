import type { SkillCategories } from '../types';

const URL = '';

export const getSkill = async (): Promise<SkillCategories> => {
	const response = await fetch(`${URL}/db/skills.json`);
	if (!response.ok) {
		throw new Error('Не удалость загрузить скиллы. ' + response.status);
	}

	const data = (await response.json()) as SkillCategories;
	return data;
};
