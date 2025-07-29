export const APP_SETTINGS = {
	paths: {
		userProfilePage: (userId: string) => `/user/${userId}`,
	},
} as const;
