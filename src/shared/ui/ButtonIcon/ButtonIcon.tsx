import type { IButtonIconProps } from './ButtonIcon.props';
import clsx from 'clsx';
import styles from './ButtonIcon.module.css';

const ButtonIcon = ({
	children,
	onClick,
	className,
	...props
}: IButtonIconProps) => {
	function onButtonClickHandler(event: React.MouseEvent<HTMLButtonElement>) {
		if (onClick) onClick(event);
	}

	return (
		<button
			className={clsx(styles.iconButton, className)}
			onClick={onButtonClickHandler}
			onKeyDown={(event) => {
				if (event.key === 'Enter') onButtonClickHandler;
			}}
			{...props}
		>
			{children}
		</button>
	);
};

export default ButtonIcon;
