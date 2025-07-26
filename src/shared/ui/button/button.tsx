import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary' | 'outlined';
	fullWidth?: boolean;
}

export const Button = ({
	children,
	variant = 'primary',
	fullWidth = false,
	className = '',
	...props
}: ButtonProps) => {
	const buttonClasses = [
		styles.button,
		styles[`variant-${variant}`],
		fullWidth && styles.fullWidth,
		className,
	]
		.filter(Boolean)
		.join(' ')
		.trim();

	return (
		<button className={buttonClasses} {...props}>
			{children}
		</button>
	);
};
