export interface LoginRequest {
	email: string;
	password: string;
}

export interface User {
	id: number;
	name: string;
	email: string;
}

export async function login(data: LoginRequest): Promise<User> {
	await new Promise((resolve) => setTimeout(resolve, 300));
	return {
		id: 1,
		name: 'Mock User',
		email: data.email,
	};
}
