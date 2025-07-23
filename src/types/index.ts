export interface City {
	id: string;
	'city-name': string;
}

export interface CitiesResponse {
	cities: City[];
}

export interface Skill {
	id: number;
	name: string;
}

export interface ImageUrl {
	url: string;
}

export interface SkillCanTeach {
	skill: string;
	skill_description: string;
	categoryId: number;
	subcategory: number;
}

export interface SubcategoryWantToLearn {
	skill: string;
	categoryId: number;
	subcategory: number;
}

export interface SkillCategory {
	id: number;
	name: string;
	icon: string;
	skills: Skill[];
}

export interface UserSkill {
	skill: string;
	categoryId: number;
	subcategory: number;
	skill_description?: string;
}

export interface User {
	id: string;
	name: string;
	email?: string;
	password?: string;
	location: string;
	gender: string;
	age: string;
	description: string;
	avatarUrl: string;
	skillCanTeach: UserSkill | UserSkill[];
	subcategoriesWantToLearn: UserSkill[];
	images?: string[];
}

export interface DatePickerProps {
	selected: Date | null;
	onChange: (date: Date | null) => void;
	placeholder?: string;
	maxDate?: Date;
	className?: string;
}

export interface FilterState {
	gender: string;
	city: string;
	categories: number[];
	skills: string[];
}

export interface HeaderProps {
	user?: User | null;
	onLogin?: () => void;
	onRegister?: () => void;
	onProfileClick?: () => void;
}
