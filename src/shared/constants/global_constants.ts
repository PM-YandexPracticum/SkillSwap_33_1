export const APP_SETTINGS = {
	paths: {
		userProfilePage: (userId: string) => `/user/${userId}`,
	},
	api: {
		getAllUsers: '/db/backend-users/users-v2.json',
		getUserById: (userId: string) =>
			`/db/backend-users/users-v2.json${userId ? '/' + userId : ''}`,
		getUsersById: (userIds: string[]) =>
			`/db/backend-users/users-v2.json${userIds ? '/' + userIds.toString() : ''}`,
	},
} as const;
