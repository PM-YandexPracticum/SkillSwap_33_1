export interface Skill {
	id: number;
	name: string;
	description: string;
}

// Интерфейс для категории навыков
export interface SkillCategory {
	id: number;
	name: string;
	icon: string;
	color: string;
	skills: Array<{
		id: number;
		name: string;
	}>;
}

// Интерфейс для города
export interface City {
	id: string;
	'city-name': string;
}
