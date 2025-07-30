// // Панель фильтров для поиска и сортировки навыков
// import React from 'react';
// import styles from './FiltersBar.module.css';
// import FilterCheckboxUI from '../../shared/ui/FilterCheckbox/FilterCheckbox';
// import type { SkillCategory } from '../../types';
// import FilterNestedUI from '../../shared/ui/FilterNested/FilterNested';
// import FilterRadioUI from '../../shared/ui/FilterRadio/FilterRadio';
// /**
//  * Компонент панели фильтров
//  * Заглушка для будущей реализации фильтров
//  */

// // Тестовые данные для проверки UI чекбокса нестеда и радио
// const checkboxItems: string[] = ['Опция 1', 'Опция 2', 'Опция 3'];
// const skillCategories: SkillCategory[] = [
// 	{
// 		id: 1,
// 		name: 'Категория 1',
// 		icon: '',
// 		skills: [
// 			{ id: 101, name: 'Навык 1' },
// 			{ id: 102, name: 'Навык 2' },
// 		],
// 	},
// 	{
// 		id: 2,
// 		name: 'Категория 2',
// 		icon: '',
// 		skills: [
// 			{ id: 201, name: 'Навык 3' },
// 			{ id: 202, name: 'Навык 4' },
// 		],
// 	},
// ];
// const radioItems: string[] = ['Радио 1', 'Радио 2', 'Радио 3'];

// export const FiltersBar: React.FC = () => {
// 	return (
// 		<div className={styles.filtersBar}>
// 			<h3 className={styles.filtersTitle}>Фильтры</h3>
// 			<FilterCheckboxUI
// 				items={checkboxItems}
// 				checkedItems={[]}
// 				showAll={false}
// 				toggleShowAll={() => {}}
// 				handleCheckboxChange={() => {}}
// 				buttonName='Показать все'
// 			/>
// 			<FilterNestedUI
// 				title='Навыки'
// 				items={skillCategories}
// 				checkedItems={[]}
// 				expandedCategories={[]}
// 				showAll={false}
// 				toggleShowAll={() => {}}
// 				toggleCategoryExpand={() => {}}
// 				toggleSkillCheck={() => {}}
// 				buttonName='Показать все'
// 				onMarkCategory={() => {}}
// 				onUnmarkCategory={() => {}}
// 			/>
// 			<FilterRadioUI
// 				title='Радио фильтр'
// 				items={radioItems}
// 				selectedItem={null}
// 				nameAttribute='radio-filter'
// 				handleChange={(item) => item}
// 			/>
// 		</div>
// 	);
// };
