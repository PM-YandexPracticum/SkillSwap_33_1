import styles from './filterCheckbox.module.css';
import chevron from '../../assets/icons/chevron-down.svg';
import clsx from 'clsx';
import emptyCheckBox from '../../assets/icons/checkbox-empty.svg';
import filledCheckBox from '../../assets/icons/checkbox-done.svg';

type Props = {
	title?: string;
	items: string[];
	checkedItems: string[];
	showAll: boolean;
	toggleShowAll: () => void;
	handleCheckboxChange: (item: string) => void;
	buttonName: string;
};

const FilterCheckboxUI = ({
	title,
	items,
	checkedItems,
	showAll,
	toggleShowAll,
	handleCheckboxChange,
	buttonName,
}: Props) => {
	const visibleItems = showAll ? items : items.slice(0, 5);

	return (
		<div className={styles.filterContainer}>
			{title && <h3 className={styles.title}>{title}</h3>}
			<ul className={styles.mainList}>
				{visibleItems.map((item) => (
					<li key={item}>
						<label className={styles.mainListPoint}>
							<input
								type='checkbox'
								checked={checkedItems.includes(item)}
								onChange={() => handleCheckboxChange(item)}
								className={styles.checkboxInput}
							/>
							{!checkedItems.includes(item) && (
								<img src={emptyCheckBox} className={styles.checkBoxImage} />
							)}
							{checkedItems.includes(item) && (
								<img src={filledCheckBox} className={styles.checkBoxImage} />
							)}
							{item}
						</label>
					</li>
				))}
				{items.length > 5 && (
					<button onClick={toggleShowAll} className={styles.bottomButton}>
						{buttonName}
						<img
							src={chevron}
							className={clsx({
								[styles.bottomButtonIcon]: true,
								[styles.bottomButtonIconReverse]: showAll,
							})}
						/>
					</button>
				)}
			</ul>
		</div>
	);
};

export default FilterCheckboxUI;
