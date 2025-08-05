import { APP_SETTINGS } from '@/shared/constants/global_constants';
import { SkillsAPI } from './skills.api';

// если остается основным интерфейсом то выносится в файл типов usersApi.ts
export interface IUserApi {
	id: string;
	name: string;
	avatarUrl: string;
	age: number;
	gender: string; // Мужской / Женский
	location: string; // Москва / Воронеж и т.д
	description: string;
	createdAt: string;
	skillsCanTeach: IUserSkillsCanTeachApi[];
	skillsWantToLearn: IUserSkillsWantsToLearnApi[];
	isExchangeSent: boolean; // предложен ли обмен этому пользователю
}

// если остается основным интерфейсом то выносится в файл типов
export interface IUserSkillsWantsToLearnApi {
	categoryId: number; // id категории
	categoryName: string; // название категории
	subcategoryId: number; // id подкатегории
	subcategoryName: string; // название подкатегории
}

// если остается основным интерфейсом то выносится в файл типов
export interface IUserSkillsCanTeachApi {
	categoryId: number; // id категории
	categoryName: string; // название категории
	subcategoryId: number; // id подкатегории
	subcategoryName: string; // название подкатегории
	description: string;
	images: string[];
}

// API для управления избранным (localStorage)
export async function getUsersDataByIdsApi(
	userIds: string[]
): Promise<IUserApi[]> {
	const allUsers = await SkillsAPI.getUsers();
	return allUsers
		.filter((user) => userIds.includes(user.id))
		.map((user) => ({
			id: user.id,
			name: user.name,
			avatarUrl: user.avatarUrl,
			age: user.age,
			gender: user.gender,
			location: user.location,
			description: user.description || '',
			createdAt: user.createdAt || new Date().toISOString(),
			skillsCanTeach: user.skillsCanTeach.map((name) => ({
				categoryId: 0,
				categoryName: '',
				subcategoryId: 0,
				subcategoryName: name,
				description: '',
				images: [],
			})),
			skillsWantToLearn: user.skillsWantToLearn.map((name) => ({
				categoryId: 0,
				categoryName: '',
				subcategoryId: 0,
				subcategoryName: name,
			})),
			isExchangeSent: Boolean(user.isExchangeSent),
		}));
}

// этот api получает всех пользователей из db/backend-users/usersV2.json типа IUserApi[]
// нужен для работы с компонентами UserCard UserCardsList FavoritesUsersList
export async function getAllUsersApi(): Promise<IUserApi[]> {
	const users = await fetch(APP_SETTINGS.api.getAllUsers)
		.then((response) => {
			if (response.ok) {
				return response.json();
			}
		})
		.then((data) => {
			return data ? (data as any[]) : [];
		})
		.then((users) =>
			users.map((u) => ({
				id: u.id,
				name: u.name,
				avatarUrl: u.avatarUrl,
				age: new Date().getFullYear() - new Date(u.birthDate).getFullYear(),
				gender: u.gender,
				location: u.location,
				description: u.description,
				createdAt: u.createdAt,
				skillsCanTeach: u.skillsCanTeach,
				skillsWantToLearn: u.skillsWantToLearn,
				isExchangeSent: u.isExchangeSent,
			}))
		)
		.catch(() => {
			return [];
		});

	return users;
}
