import React from 'react';
import styles from './SuccessModal.module.css';
import { Button } from '@/shared/ui/button/button';
import DoneIcon from '@/shared/assets/icons/Done.svg?react';

interface SuccessModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
}) => {
	if (!isOpen) return null;

	return (
		<div className={styles.overlay} onClick={onClose}>
			<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
				<div className={styles.iconContainer}>
					<DoneIcon className={styles.icon} />
				</div>

				<div className={styles.content}>
					<h2 className={styles.title}>Ваше предложение создано</h2>
					<p className={styles.subtitle}>Теперь вы можете предложить обмен</p>
				</div>

				<div className={styles.actions}>
					<Button
						variant='primary'
						onClick={onConfirm}
						className={styles.confirmButton}
					>
						Готово
					</Button>
				</div>
			</div>
		</div>
	);
};

export default SuccessModal;
