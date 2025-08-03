import { useState } from 'react';
import FilterCheckboxUI from '../../shared/ui/FilterCheckbox/FilterCheckbox';

type Props = {
	title?: string;
	items: string[];
	buttonName: string;
	checkedItems: string[];
	handleCheckBoxChange: (item: string) => void;
};

const FilterCheckbox = ({
	title,
	items,
	buttonName,
	checkedItems,
	handleCheckBoxChange,
}: Props) => {
	const [showAll, setShowAll] = useState(false);

	const toggleShowAll = () => {
		setShowAll((prev) => !prev);
	};

	return (
		<FilterCheckboxUI
			title={title}
			items={items}
			checkedItems={checkedItems}
			showAll={showAll}
			toggleShowAll={toggleShowAll}
			handleCheckboxChange={handleCheckBoxChange}
			buttonName={buttonName}
		/>
	);
};
export default FilterCheckbox;
