export interface User {
	id: number;
	name: string;
	email: string;
	// Дополнительные поля для SkillCard
	avatarUrl?: string;
	birthDate?: string;
	genderId?: string;
	locationId?: string;
	description?: string;
	createdAt?: string;
	skillsCanTeach?: Array<{
		subcategoryId: number;
		description: string;
		images: string[];
	}>;
	skillsWantToLearn?: number[];
}

// Интерфейс для отображения пользователя в карточке
export interface UserCardData {
	id: string;
	name: string;
	avatarUrl: string;
	location: string;
	age: number;
	skillsCanTeach: string[];
	skillsWantToLearn: string[];
	isFavorite?: boolean;
	createdAt?: string; // Дата создания аккаунта
}

export interface UserDetailData {
	id: string;
	skillsCanTeach: Array<{
		subcategoryId: number;
		title: string;
		category: string;
		description: string;
		images: string[];
	}>;
}
