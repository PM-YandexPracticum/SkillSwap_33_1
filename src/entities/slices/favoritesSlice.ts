import { getUsersDataByIdsApi, type IUserApi } from '@/api/favorites.api';
import { LOCAL_STORAGE_PATHS } from '@/shared/constants/local_storage_paths';
import { getCurrentUser } from '@/features/auth/AuthForm.model';
import {
	createAsyncThunk,
	createSlice,
	type PayloadAction,
} from '@reduxjs/toolkit';

interface IFavoritesState {
	favoriteUsersIds: string[];
	favoriteUsers: IUserApi[];
	isLoading: boolean;
	isInitialLoaded: boolean;
	error: string | undefined;
}

const initialState: IFavoritesState = {
	favoriteUsersIds: [],
	favoriteUsers: [],
	isLoading: false,
	isInitialLoaded: false,
	error: undefined,
};

export const asyncThunkGetUsersAddedIntoFavorites = createAsyncThunk(
	'favorites/asyncThunkGetUsersAddedIntoFavorites',
	async () => {
		const user = getCurrentUser();
		if (!user) {
			return [] as IUserApi[];
		}
		const store = JSON.parse(
			localStorage.getItem(LOCAL_STORAGE_PATHS.favoriteUsers) ?? '{}'
		);
		const favoriteUsersIds: string[] = store[`usr_${user.id}`] ?? [];
		if (favoriteUsersIds.length === 0) {
			return [] as IUserApi[];
		}
		return await getUsersDataByIdsApi(favoriteUsersIds);
	}
);

export const favoritesSlice = createSlice({
	name: 'favorites',
	initialState,
	reducers: {
		setUsersLoaded: (state) => {
			state.isInitialLoaded = true;
		},
		toggleFavoriteUser: (
			state,
			{
				payload: { isUserAdded, userId },
			}: PayloadAction<{ userId: string; isUserAdded: boolean }>
		) => {
			const current = getCurrentUser();
			if (!current) return;

			const store = JSON.parse(
				localStorage.getItem(LOCAL_STORAGE_PATHS.favoriteUsers) ?? '{}'
			);
			const key = `usr_${current.id}`;
			const ids: string[] = store[key] ?? [];

			let newIds: string[];
			if (isUserAdded) {
				newIds = ids.filter((id) => id !== userId);
				state.favoriteUsers = state.favoriteUsers.filter(
					(selectedUser) => selectedUser.id !== userId
				);
			} else {
				newIds = Array.from(new Set([...ids, userId]));
			}

			store[key] = newIds;
			localStorage.setItem(
				LOCAL_STORAGE_PATHS.favoriteUsers,
				JSON.stringify(store)
			);

			state.favoriteUsersIds = newIds;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(asyncThunkGetUsersAddedIntoFavorites.pending, (state) => {
				state.isLoading = true;
				state.error = undefined;
			})
			.addCase(
				asyncThunkGetUsersAddedIntoFavorites.fulfilled,
				(state, action: PayloadAction<IUserApi[]>) => {
					state.isLoading = false;
					state.favoriteUsers = action.payload;
					state.isInitialLoaded = true;
					state.favoriteUsersIds = action.payload?.map((user) => user.id);
				}
			)
			.addCase(
				asyncThunkGetUsersAddedIntoFavorites.rejected,
				(state, action) => {
					state.isLoading = false;
					state.error = action.error.message;
				}
			);
	},
	selectors: {
		getAllFavoriteUsers: (state) => state.favoriteUsers,
		isUserLiked: (state, action: PayloadAction<string>) =>
			state.favoriteUsersIds.includes(action.payload),
	},
});

export const asyncThunkSetLikeUserState = createAsyncThunk(
	'favorites/asyncThunkSetLikeUserState',
	async (
		{ userId, isLiked }: { userId: string; isLiked: boolean },
		{ dispatch }
	) => {
		await dispatch(
			favoritesSlice.actions.toggleFavoriteUser({
				userId,
				isUserAdded: isLiked,
			})
		);
		await dispatch(asyncThunkGetUsersAddedIntoFavorites());
	}
);

export const { toggleFavoriteUser, setUsersLoaded } = favoritesSlice.actions;
export const { getAllFavoriteUsers, isUserLiked } = favoritesSlice.selectors;
export default favoritesSlice.reducer;
