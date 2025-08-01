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
	placeholder?: string;
	type?: HTMLInputTypeAttribute;
	inputError?: {
		errorType: InputErrorType;
		message?: string;
	};
}
