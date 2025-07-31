import {
	createAsyncThunk,
	createSelector,
	createSlice,
} from '@reduxjs/toolkit';
import { getUsers } from '../../api/usersApi';
import type { User, UserSkill, Users } from '../../types';
import type { RootState } from '../../app/providers/store/StoreProvider';
import type { FiltersState } from './filtersSlice';

type UsersState = {
	users: Users;
	isLoading: boolean;
	error: string | undefined;
};

const savedUsers = localStorage.getItem('users');

const initialState: UsersState = {
	users: savedUsers ? (JSON.parse(savedUsers) as Users) : [],
	isLoading: false,
	error: undefined,
};

export const fetchUsers = createAsyncThunk('users/fetchUsers', getUsers);

export const usersSlice = createSlice({
	name: 'users',
	initialState,
	reducers: {
		setUserSkillToTeach: (
			state,
			action: { payload: { id: string; skill: UserSkill } }
		) => {
			const { id, skill } = action.payload;
			const user = state.users.find((user) => user.id === id);
			if (user) {
				user.skillCanTeach = [skill];
				localStorage.setItem('users', JSON.stringify(state.users));
			}
		},
		addUser: (state, action: { payload: User }) => {
			state.users.unshift(action.payload);
			localStorage.setItem('users', JSON.stringify(state.users));
		},
		updateUser: (state, action: { payload: User }) => {
			const index = state.users.findIndex(
				(user) => user.id === action.payload.id
			);
			if (index !== -1) {
				state.users[index] = action.payload;
			} else {
				state.users.unshift(action.payload);
			}
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchUsers.pending, (state) => {
				state.isLoading = true;
				state.error = undefined;
			})
			.addCase(fetchUsers.fulfilled, (state, action) => {
				state.isLoading = false;
				const fetchedUsers = action.payload;
				const existingIds = new Set(state.users.map((u) => u.id));
				const newUsers = fetchedUsers.filter((u) => !existingIds.has(u.id));

				state.users = [...state.users, ...newUsers];
			})
			.addCase(fetchUsers.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message;
			});
	},
	selectors: {
		getUserById: (state, id: string) => {
			return state.users.find((user) => user.id === id);
		},
	},
});

export const selectAllUsers = (state: RootState) => state.users.users;
export const selectAllUsersCity = createSelector([selectAllUsers], (users) => [
	...new Set(users.map((user) => user.city)),
]);

export const selectUsersWithSameOffer = createSelector(
	[selectAllUsers, (_: RootState, user: User) => user],
	(allUsers, user): Users => {
		const result: Users = [];

		user.skillCanTeach.forEach((skill) => {
			allUsers.forEach((otherUser) => {
				if (user.id !== otherUser.id) {
					const hasSameSkill = otherUser.skillCanTeach.some(
						(otherSkill) => otherSkill.skill === skill.skill
					);
					if (hasSameSkill) {
						result.push(otherUser);
					}
				}
			});
		});

		return result;
	}
);

export const getFilteredUsers = createSelector(
	[selectAllUsers, (_: RootState, filters: FiltersState) => filters],
	(allUsers, filters: FiltersState) => {
		return allUsers.filter((user: User) => {
			if (filters.gender !== 'Не имеет значения') {
				const genderMap: { [key: string]: string } = {
					Мужской: 'male',
					Женский: 'female',
				};
				if (user.gender !== genderMap[filters.gender]) {
					return false;
				}
			}

			if (filters.cities.length > 0 && !filters.cities.includes(user.city)) {
				return false;
			}

			if (filters.skills.length > 0) {
				const skillsToTeachIds = user.skillCanTeach.map((s) => s.subcategory);
				const skillsToLearnIds = user.skillCanTeach.map((s) => s.subcategory);

				const hasSkill = (skillIdStr: number) => {
					const skillId = Number(skillIdStr);
					if (isNaN(skillId)) return false;
					return (
						skillsToTeachIds.includes(skillId) ||
						skillsToLearnIds.includes(skillId)
					);
				};

				const hasSkillToTeach = (skillIdStr: number) => {
					const skillId = Number(skillIdStr);
					if (isNaN(skillId)) return false;
					return skillsToTeachIds.includes(skillId);
				};

				const hasSkillToLearn = (skillIdStr: number) => {
					const skillId = Number(skillIdStr);
					if (isNaN(skillId)) return false;
					return skillsToLearnIds.includes(skillId);
				};

				switch (filters.type) {
					case 'Могу научить':
						if (!filters.skills.some(hasSkillToTeach)) {
							return false;
						}
						break;

					case 'Хочу научиться':
						if (!filters.skills.some(hasSkillToLearn)) {
							return false;
						}
						break;

					case 'Всё':
					default:
						if (!filters.skills.some(hasSkill)) {
							return false;
						}
						break;
				}
			}

			if (filters.search) {
				const findInSkillsToLearn = user.skillCanLearn.some((skillItem) =>
					skillItem.skill
						.toLocaleLowerCase()
						.includes(filters.search.toLocaleLowerCase())
				);
				const findInSkillsToTeach = user.skillCanTeach.some((skillItem) =>
					skillItem.skill
						.toLocaleLowerCase()
						.includes(filters.search.toLocaleLowerCase())
				);

				return findInSkillsToLearn || findInSkillsToTeach;
			}

			return true;
		});
	}
);
export const { getUserById } = usersSlice.selectors;
export const { setUserSkillToTeach, addUser, updateUser } = usersSlice.actions;

export default usersSlice.reducer;
