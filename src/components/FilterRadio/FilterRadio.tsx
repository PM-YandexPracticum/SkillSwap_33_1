import { useRef } from 'react';
import FilterRadioUI from '../../shared/ui/FilterRadio/FilterRadio';

type Props = {
	title?: string;
	items: string[];
	selectedItem: string | null;
	handleChange: (item: string) => void;
};

const FilterRadio = ({ title, items, selectedItem, handleChange }: Props) => {
	const randomNameRef = useRef<string>(Math.random().toString(36).slice(2, 11));
	const nameAttribute = title ? title : randomNameRef.current;

	return (
		<FilterRadioUI
			items={items}
			selectedItem={selectedItem}
			nameAttribute={nameAttribute}
			handleChange={handleChange}
			title={title}
		/>
	);
};
export default FilterRadio;
