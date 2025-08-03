import type { FiltersState } from '../../../entities/slices/filtersSlice';
import type { SkillCategories } from '../../../types';
import FilterCheckbox from '../../../components/FilterCheckbox/FilterCheckbox';
import FilterNested from '../../../components/FilterNested/FilterNested';
import FilterRadio from '../../../components/FilterRadio/FilterRadio';
import styles from './FilterBarUI.module.css';

export type Props = {
	mainFilter: string[];
	skills: SkillCategories;
	sexFilter: string[];
	cityFilter: string[];
	activeFilters: FiltersState;
	onMainFilterChange: (value: string) => void;
	onGenderChange: (value: string) => void;
	onSkillToggle: (id: number) => void;
	onCityToggle: (city: string) => void;
	onMarkCategory: (categoryId: number) => void;
	onUnmarkCategory: (categoryId: number) => void;
};

const FilterBarUI = ({
	mainFilter,
	skills,
	sexFilter,
	cityFilter,
	activeFilters,
	onMainFilterChange,
	onGenderChange,
	onSkillToggle,
	onCityToggle,
	onMarkCategory,
	onUnmarkCategory,
}: Props) => {
	return (
		<aside className={styles.asideContainer}>
			<h2 className={styles.asideTitle}>Фильтры</h2>
			<FilterRadio
				items={mainFilter}
				selectedItem={activeFilters.type}
				handleChange={onMainFilterChange}
			/>
			<FilterNested
				items={skills}
				title='Навыки'
				buttonName='Все категории'
				checkedItems={activeFilters.skills.map((id) => Number(id))}
				toggleSkillCheck={onSkillToggle}
				onMarkCategory={onMarkCategory}
				onUnmarkCategory={onUnmarkCategory}
			/>
			<FilterRadio
				items={sexFilter}
				title={'Пол автора'}
				selectedItem={activeFilters.gender}
				handleChange={onGenderChange}
			/>
			<FilterCheckbox
				items={cityFilter}
				title='Город'
				buttonName='Все города'
				checkedItems={activeFilters.cities}
				handleCheckBoxChange={onCityToggle}
			/>
		</aside>
	);
};

export default FilterBarUI;
