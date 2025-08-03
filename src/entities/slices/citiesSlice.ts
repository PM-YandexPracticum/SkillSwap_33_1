import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getCities } from '../../api/citiesApi';
import type { Cities } from '../../types';

type CitiesState = {
	cities: Cities;
	isLoading: boolean;
	error: string | undefined;
};

const initialState: CitiesState = {
	cities: [],
	isLoading: false,
	error: undefined,
};

export const fetchCities = createAsyncThunk('users/fetchCities', getCities);

export const citiesSlice = createSlice({
	name: 'cities',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchCities.pending, (state) => {
				state.isLoading = true;
				state.error = undefined;
			})
			.addCase(fetchCities.fulfilled, (state, action) => {
				state.isLoading = false;
				state.cities = action.payload;
			})
			.addCase(fetchCities.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message;
			});
	},
	selectors: {
		selectAllCities: (state) => state.cities,
	},
});

export const { selectAllCities } = citiesSlice.selectors;
export default citiesSlice.reducer;
