import type {
	DetailedHTMLProps,
	HTMLAttributes,
	HTMLInputTypeAttribute,
} from 'react';

type InputPropsType = DetailedHTMLProps<
	HTMLAttributes<HTMLInputElement>,
	HTMLInputElement
>;

type InputErrorType = 'warning' | 'error' | 'none';

export interface IInputProps extends InputPropsType {
	labelTitle?: string;
	showTooltipIcon?: boolean;
	tooltipIcon?: React.ReactElement<SVGElement>;
	placeholder?: string;
	type?: HTMLInputTypeAttribute;
	inputError?: {
		errorType: InputErrorType;
		message?: string;
	};
}
