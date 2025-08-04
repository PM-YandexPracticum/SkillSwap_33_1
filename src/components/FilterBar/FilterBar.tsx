import {
	markCategorySkills,
	selectFilters,
	setGender,
	setType,
	toggleCity,
	toggleSkill,
	unmarkCategorySkills,
} from '../../entities/slices/filtersSlice';
import { selectAllSkills } from '../../entities/slices/skillsSlice';
import {
	selectAllCities,
	fetchCities,
} from '../../entities/slices/citiesSlice';
import {
	useAppDispatch,
	useAppSelector,
} from '../../app/providers/store/hooks';
import FilterBarUI from '../../shared/ui/FilterBarUI/FilterBarUI';
import { useEffect } from 'react';
import { fetchSkills } from '../../entities/slices/skillsSlice';

const FilterBar = () => {
	const dispatch = useAppDispatch();
	const filters = useAppSelector(selectFilters);
	const mainFilter = ['Всё', 'Хочу научиться', 'Могу научить'];
	const sexFilter = ['Не имеет значения', 'Мужской', 'Женский'];
	const cities = useAppSelector(selectAllCities);
	const cityFilter = cities.map((c) => c['city-name']);
	const skills = useAppSelector(selectAllSkills);
	// console.log('skills from selector:', skills);
	useEffect(() => {
		dispatch(fetchSkills());
		dispatch(fetchCities());
	}, [dispatch]);

	const handleMainFilterChange = (value: string) => {
		dispatch(setType(value));
	};

	const handleGenderChange = (value: string) => {
		dispatch(setGender(value));
	};

	const handleSkillToggle = (skillId: number) => {
		dispatch(toggleSkill(skillId));
	};

	const handleCityToggle = (city: string) => {
		dispatch(toggleCity(city));
	};

	const handleMarkCategory = (categoryId: number) => {
		const category = skills.find((c) => c.id === categoryId);
		if (category) {
			const skillIds = category.skills.map((s) => s.id);
			dispatch(markCategorySkills(skillIds));
		}
	};

	const handleUnmarkCategory = (categoryId: number) => {
		const category = skills.find((c) => c.id === categoryId);
		if (category) {
			const skillIds = category.skills.map((s) => s.id);
			dispatch(unmarkCategorySkills(skillIds));
		}
	};

	return (
		<FilterBarUI
			mainFilter={mainFilter}
			skills={skills}
			sexFilter={sexFilter}
			cityFilter={cityFilter}
			activeFilters={filters}
			onMainFilterChange={handleMainFilterChange}
			onGenderChange={handleGenderChange}
			onSkillToggle={handleSkillToggle}
			onCityToggle={handleCityToggle}
			onMarkCategory={handleMarkCategory}
			onUnmarkCategory={handleUnmarkCategory}
		/>
	);
};
export default FilterBar;
