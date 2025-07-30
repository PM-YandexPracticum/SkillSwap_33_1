import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { SkillCategories } from '../../types';
import { getSkill } from '../../api/getSkill.api';
import type { RootState } from '../../app/providers/store/StoreProvider';

type SkillsState = {
	skills: SkillCategories;
	isLoading: boolean;
	error: string | undefined;
};

const initialState: SkillsState = {
	skills: [],
	isLoading: false,
	error: undefined,
};

export const fetchSkills = createAsyncThunk('skills/fetchSkills', getSkill);

export const skillsSlice = createSlice({
	name: 'skills',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchSkills.pending, (state) => {
				state.isLoading = true;
				state.error = undefined;
			})
			.addCase(fetchSkills.fulfilled, (state, action) => {
				state.isLoading = false;
				state.skills = action.payload;
			})
			.addCase(fetchSkills.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message;
			});
	},
	// selectors: {
	// 	selectAllSkills: (state) => state.skills,
	// },
});

export const selectAllSkills = (state: RootState) => state.skills.skills;
export default skillsSlice.reducer;
