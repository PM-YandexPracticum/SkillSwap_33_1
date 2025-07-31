import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type FiltersState = {
	type: string;
	skills: number[];
	gender: string;
	cities: string[];
	search: string;
};

const initialState: FiltersState = {
	type: 'Всё',
	skills: [],
	gender: 'Не имеет значения',
	cities: [],
	search: '',
};

export const filtersSlice = createSlice({
	name: 'filters',
	initialState,
	reducers: {
		setType: (state, action: PayloadAction<string>) => {
			state.type = action.payload;
		},
		setGender: (state, action: PayloadAction<string>) => {
			state.gender = action.payload;
		},
		toggleSkill: (state, action: PayloadAction<number>) => {
			const skillId = action.payload;
			const index = state.skills.indexOf(skillId);
			if (index >= 0) {
				state.skills.splice(index, 1);
			} else {
				state.skills.push(skillId);
			}
		},
		toggleCity: (state, action: PayloadAction<string>) => {
			const city = action.payload;
			const index = state.cities.indexOf(city);
			if (index >= 0) {
				state.cities.splice(index, 1);
			} else {
				state.cities.push(city);
			}
		},
		markCategorySkills: (state, action: PayloadAction<number[]>) => {
			const skillsToAdd = action.payload;
			const skillSet = new Set(state.skills);
			skillsToAdd.forEach((skillId) => skillSet.add(skillId));
			state.skills = Array.from(skillSet);
		},
		unmarkCategorySkills: (state, action: PayloadAction<number[]>) => {
			const skillsToRemove = action.payload;
			const skillsToRemoveSet = new Set(skillsToRemove);
			state.skills = state.skills.filter(
				(skillId) => !skillsToRemoveSet.has(skillId)
			);
		},
		setSearchFilter: (state, action: PayloadAction<string>) => {
			state.search = action.payload;
		},
	},
	selectors: {
		selectFilters: (state) => state,
	},
});

export const {
	setType,
	setGender,
	toggleSkill,
	toggleCity,
	markCategorySkills,
	unmarkCategorySkills,
	setSearchFilter,
} = filtersSlice.actions;
export const { selectFilters } = filtersSlice.selectors;
export default filtersSlice.reducer;
