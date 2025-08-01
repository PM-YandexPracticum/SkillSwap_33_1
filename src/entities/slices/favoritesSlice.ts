import { getUsersDataByIdsApi, type IUserApi } from '@/api/favorites.api';
import { LOCAL_STORAGE_PATHS } from '@/shared/constants/local_storage_paths';
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
		const favoriteUsersIds: string[] = JSON.parse(
			localStorage.getItem(LOCAL_STORAGE_PATHS.favoriteUsers) ?? '[]'
		);
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
			if (isUserAdded) {
				state.favoriteUsers = state.favoriteUsers.filter(
					(selectedUser) => selectedUser.id !== userId
				);
				state.favoriteUsersIds = state.favoriteUsersIds.filter(
					(id) => id !== userId
				);
			} else {
				state.favoriteUsersIds.push(userId);
			}

			localStorage.setItem(
				LOCAL_STORAGE_PATHS.favoriteUsers,
				JSON.stringify(
					Array.from(new Set(state.favoriteUsersIds.map((id) => id)))
				)
			);
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
