import type { FC } from 'react';
import type { TModalUIProps } from './type';
import styles from './modal.module.css';
import { Button } from '../button/button';

export const ModalUI: FC<TModalUIProps> = ({
	isOpen,
	onClose,
	icon,
	message,
	title,
}) => {
	if (!isOpen) return null;

	return (
		<div className={styles.overlay} onClick={onClose}>
			<div
				className={styles.modal}
				onClick={(e) => {
					e.stopPropagation();
				}}
			>
				<img className={styles.icon} src={icon} alt='Icon' />
				<div className={styles.description}>
					<h2>{title}</h2>
					<p>{message}</p>
				</div>
				<Button fullWidth={true} onClick={onClose}>
					Готово
				</Button>
			</div>
		</div>
	);
};
