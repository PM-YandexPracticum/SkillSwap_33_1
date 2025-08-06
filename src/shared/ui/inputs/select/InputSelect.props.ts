import type { Props as SelectProps } from 'react-select';

export interface IInputSelectOptionType {
	value: string | number;
	label: string;
}

export interface IInputSelectProps
	extends Omit<SelectProps<IInputSelectOptionType, boolean>, 'options'> {
	selectTitle?: string;
	options: IInputSelectOptionType[];
	selectType?: 'list' | 'checkboxes';
}
