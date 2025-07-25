import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from './user';
import * as authApi from '@/api/auth.api';

export interface UserState {
	currentUser: User | null;
	status: 'idle' | 'loading' | 'failed';
}

const initialState: UserState = {
	currentUser: null,
	status: 'idle',
};

export const login = createAsyncThunk(
	'user/login',
	async (data: authApi.LoginRequest) => {
		const user = await authApi.login(data);
		return user;
	}
);

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		logout(state) {
			state.currentUser = null;
			state.status = 'idle';
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(login.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
				state.status = 'idle';
				state.currentUser = action.payload;
			})
			.addCase(login.rejected, (state) => {
				state.status = 'failed';
			});
	},
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
