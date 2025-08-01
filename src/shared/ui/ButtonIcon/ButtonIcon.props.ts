import type { DetailedHTMLProps, HTMLAttributes } from 'react';

type ButtonIconPropsType = DetailedHTMLProps<
	HTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
>;

export interface IButtonIconProps extends ButtonIconPropsType {
	children?: React.ReactNode;
}
