import type { SkillCategory } from '../../../types';
import styles from './filterNested.module.css';
import clsx from 'clsx';
import ChevronIcon from '../../assets/icons/chevron-down.svg?react';
import EmptyCheckBoxIcon from '../../assets/icons/checkbox-empty.svg?react';
import FilledCheckBoxIcon from '../../assets/icons/checkbox-done.svg?react';
import DeleteCheckBoxIcon from '../../assets/icons/checkbox-remove.svg?react';

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

		if (checkedInCategory === 0) return 'none';
		if (checkedInCategory === category.skills.length) return 'all';
		return 'some';
	};

	return (
		<div className={styles.filterContainer}>
			{title && <h3 className={styles.title}>{title}</h3>}
			{visibleItems.map((category) => {
				const checkState = getCategoryCheckState(category);

				return (
					<ul key={category.id} className={styles.mainList}>
						<li
							className={styles.mainListPoint}
							onClick={() => toggleCategoryExpand(category.id)}
						>
							{checkState === 'none' && (
								<EmptyCheckBoxIcon
									className={styles.checkBoxIcon}
									onClick={(e) => {
										e.stopPropagation();
										onMarkCategory(category.id);
									}}
								/>
							)}
							{checkState === 'some' && (
								<DeleteCheckBoxIcon
									className={styles.checkBoxIcon}
									onClick={(e) => {
										e.stopPropagation();
										onUnmarkCategory(category.id);
									}}
								/>
							)}
							{checkState === 'all' && (
								<FilledCheckBoxIcon
									className={styles.checkBoxIcon}
									onClick={(e) => {
										e.stopPropagation();
										onUnmarkCategory(category.id);
									}}
								/>
							)}
							<span className={styles.mainListCategory}>{category.name}</span>
							<ChevronIcon
								className={clsx(styles.bottomButtonIcon, {
									[styles.bottomButtonIconReverse]: expandedCategories.includes(
										category.id
									),
								})}
							/>
						</li>

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
											{checkedItems.includes(skill.id) ? (
												<FilledCheckBoxIcon className={styles.checkBoxIcon} />
											) : (
												<EmptyCheckBoxIcon className={styles.checkBoxIcon} />
											)}
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
					<ChevronIcon
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
