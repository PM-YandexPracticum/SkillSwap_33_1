import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from '@/entities/user/userSlice';
import filtersReducer from '@/entities/slices/filtersSlice';
import usersReducer from '@/entities/slices/usersSlice';
import citiesReducer from '@/entities/slices/citiesSlice';
import skillsReducer from '@/entities/slices/skillsSlice';
import favoritesReducer from '@/entities/slices/favoritesSlice';

import {
	type TypedUseSelectorHook,
	useDispatch as dispatchHook,
	useSelector as selectorHook,
} from 'react-redux';

const rootReducer = combineReducers({
	user: userReducer,
	skills: skillsReducer,
	filters: filtersReducer,
	users: usersReducer,
	cities: citiesReducer,
	favorites: favoritesReducer,
	// app: appSlice,
});

const store = configureStore({
	reducer: rootReducer,
	devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;

// import { combineSlices, configureStore } from '@reduxjs/toolkit';

// import filtersSlice from '../entities/slices/filtersSlice';
// import usersSlice from '../entities/slices/usersSlice';
// import citiesSlice from '../entities/slices/citiesSlice';
// import skillsSlice from '../entities/slices/skillsSlice';

// export const rootReducer = combineSlices({
// 	skills: skillsSlice,
// 	filters: filtersSlice,
// 	users: usersSlice,
// 	cities: citiesSlice,
// });

// export const store = configureStore({
// 	reducer: rootReducer,
// 	devTools: process.env.NODE_ENV !== 'production',
// });

// export type RootState = ReturnType<typeof rootReducer>;
// export type AppDispatch = typeof store.dispatch;
// export type AppStore = typeof store;

// export default store;
