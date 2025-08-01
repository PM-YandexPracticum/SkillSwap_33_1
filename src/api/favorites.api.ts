import { APP_SETTINGS } from '@/shared/constants/global_constants';

// если остается основным интерфейсом то выносится в файл типов
export interface IUserApi {
	id: string;
	name: string;
	avatarUrl: string;
	birthDate: string;
	gender: string;
	location: string;
	description: string;
	createdAt: string;
	skillsCanTeach: IUserSkillsCanTeachApi[];
	skillsWantToLearn: IUserSkillsWantsToLearnApi[];
	isExchangeSent: boolean;
}

// если остается основным интерфейсом то выносится в файл типов
export interface IUserSkillsWantsToLearnApi {
	categoryId: number;
	categoryName: string;
	subcategoryId: number;
	subcategoryName: string;
}

// если остается основным интерфейсом то выносится в файл типов
export interface IUserSkillsCanTeachApi {
	categoryId: number;
	categoryName: string;
	subcategoryId: number;
	subcategoryName: string;
	description: string;
	images: string[];
}

// API для управления избранным (localStorage)
export async function getUsersDataByIdsApi(
	userIds: string[]
): Promise<IUserApi[]> {
	const users = await fetch(APP_SETTINGS.api.getUsersById())
		.then((response) => {
			if (response.ok) {
				return response.json();
			}
		})
		.then((data) => {
			return data ? (data as IUserApi[]) : [];
		})
		.then((users) => {
			return users
				? users.filter((user) => userIds.includes(String(user.id)))
				: [];
		})
		.catch(() => {
			return [];
		});

	return users;
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
			return data ? (data as IUserApi[]) : [];
		})
		.catch(() => {
			return [];
		});

	return users;
}
