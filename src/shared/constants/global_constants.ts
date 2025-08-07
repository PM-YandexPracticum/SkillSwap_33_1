export const APP_SETTINGS = {
        paths: {
                userProfilePage: (userId: string) => `/skills/${userId}`,
        },
        api: {
                getAllUsers: '/db/backend-users/users-v2.json',
                getUserById: (/*userId: string*/) => `/db/backend-users/users-v2.json`,
                getUsersById: (/*userIds: string[]*/) => `/db/backend-users/users-v2.json`,
	},
} as const;
