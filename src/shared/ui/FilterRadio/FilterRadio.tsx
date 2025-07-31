import styles from './filterRadio.module.css';

type Props = {
	title?: string;
	items: string[];
	selectedItem: string | null;
	nameAttribute: string;
	handleChange: (item: string) => void;
};

const FilterRadioUI = ({
	title,
	items,
	selectedItem,
	nameAttribute,
	handleChange,
}: Props) => {
	return (
		<>
			<div className={styles.labelList}>
				{title && <h3 className={styles.listTitle}>{title}</h3>}
				{items.map((item) => (
					<label key={item} className={styles.label}>
						<input
							type='radio'
							name={nameAttribute}
							value={item}
							checked={selectedItem === item}
							onChange={() => handleChange(item)}
							className={styles.radioButton}
						/>
						{item}
					</label>
				))}
			</div>
		</>
	);
};

export default FilterRadioUI;
