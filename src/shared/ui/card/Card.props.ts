import type { DetailedHTMLProps, HTMLAttributes } from 'react';

type CardPropsType = DetailedHTMLProps<
	HTMLAttributes<HTMLDivElement>,
	HTMLDivElement
>;

export interface ICardProps extends CardPropsType {
	children: React.ReactNode;
}
