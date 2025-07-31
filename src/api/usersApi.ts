import type { Users } from '../types';

const URL = '';

export const getUsers = async (): Promise<Users> => {
	const response = await fetch(`${URL}/db/users.json`);
	if (!response.ok) {
		throw new Error('Не удалость загрузить пользователей. ' + response.status);
	}

	const data = (await response.json()) as Users;
	return data;
};
