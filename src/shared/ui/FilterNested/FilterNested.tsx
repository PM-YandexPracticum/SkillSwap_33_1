import type { SkillCategory } from '../../../types';
import styles from './filterNested.module.css';
import chevron from '../../assets/icons/chevron-down.svg';
import clsx from 'clsx';
import emptyCheckBox from '../../assets/icons/checkbox-empty.svg';
import filledCheckBox from '../../assets/icons/checkbox-done.svg';
import deleteCheckBox from '../../assets/icons/checkbox-remove.svg';

type Props = {
	title?: string;
	items: SkillCategory[];
	checkedItems: number[];
	expandedCategories: number[];
	showAll: boolean;
	toggleShowAll: () => void;
	toggleCategoryExpand: (categoryId: number) => void;
	toggleSkillCheck: (skillId: number) => void;
	buttonName: string;
	onMarkCategory: (categoryId: number) => void;
	onUnmarkCategory: (categoryId: number) => void;
};

const FilterNestedUI = ({
	title,
	items,
	checkedItems,
	expandedCategories,
	showAll,
	toggleShowAll,
	toggleCategoryExpand,
	toggleSkillCheck,
	buttonName,
	onMarkCategory,
	onUnmarkCategory,
}: Props) => {
	const visibleItems = showAll ? items : items.slice(0, 5);

	const getCategoryCheckState = (category: SkillCategory) => {
		const categorySkillIds = new Set(category.skills.map((s) => s.id));
		const checkedInCategory = checkedItems.filter((id) =>
			categorySkillIds.has(id)
		).length;

		if (checkedInCategory === 0) {
			return 'none';
		}
		if (checkedInCategory === category.skills.length) {
			return 'all';
		}
		return 'some';
	};

	return (
		<div className={styles.filterContainer}>
			{title && <h3 className={styles.title}>{title}</h3>}
			{visibleItems.map((category) => {
				const checkState = getCategoryCheckState(category);

				return (
					<ul key={category.id} className={styles.mainList}>
						{/* Категория с кнопкой раскрытия */}
						<li
							className={styles.mainListPoint}
							onClick={() => toggleCategoryExpand(category.id)}
						>
							{checkState === 'none' && (
								<img
									src={emptyCheckBox}
									alt='Выбрать все'
									onClick={() => onMarkCategory(category.id)}
									style={{ cursor: 'pointer' }}
								/>
							)}
							{checkState === 'some' && (
								<img
									src={deleteCheckBox}
									alt='Снять все'
									onClick={() => onUnmarkCategory(category.id)}
									style={{ cursor: 'pointer' }}
								/>
							)}
							{checkState === 'all' && (
								<img
									src={filledCheckBox}
									alt='Снять все'
									onClick={() => onUnmarkCategory(category.id)}
									style={{ cursor: 'pointer' }}
								/>
							)}
							<span className={styles.mainListCategory}>{category.name}</span>
							<img
								alt=''
								src={chevron}
								className={clsx(styles.bottomButtonIcon, {
									[styles.bottomButtonIconReverse]: expandedCategories.includes(
										category.id
									),
								})}
							/>
						</li>
						{/* Внутри раскрытой категории список навыков */}
						{expandedCategories.includes(category.id) && (
							<ul className={styles.extraList}>
								{category.skills.map((skill) => (
									<li key={skill.id}>
										<label className={styles.extraListPoint}>
											<input
												type='checkbox'
												checked={checkedItems.includes(skill.id)}
												onChange={() => toggleSkillCheck(skill.id)}
												className={styles.checkboxInput}
											/>
											<img
												src={
													checkedItems.includes(skill.id)
														? filledCheckBox
														: emptyCheckBox
												}
												alt=''
											/>
											{skill.name}
										</label>
									</li>
								))}
							</ul>
						)}
					</ul>
				);
			})}
			{items.length > 5 && (
				<button onClick={toggleShowAll} className={styles.bottomButton}>
					{showAll ? 'Свернуть' : buttonName}
					<img
						alt=''
						src={chevron}
						className={clsx(styles.bottomButtonIcon, {
							[styles.bottomButtonIconReverse]: showAll,
						})}
					/>
				</button>
			)}
		</div>
	);
};

export default FilterNestedUI;
