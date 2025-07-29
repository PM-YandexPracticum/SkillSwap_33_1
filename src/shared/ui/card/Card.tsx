import clsx from 'clsx';
import styles from './Card.module.css';
import type { ICardProps } from './Card.props';

export const Card = ({ children, className, ...props }: ICardProps) => {
	return (
		<div className={clsx(className, styles.card)} {...props}>
			{children}
		</div>
	);
};
