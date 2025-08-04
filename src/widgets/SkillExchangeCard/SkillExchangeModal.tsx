import React from 'react';
import styles from './SkillExchangeModal.module.css';
import { Button } from '@/shared/ui/button/button';
import NotificationIcon from '@/shared/assets/icons/Notification.svg?react';

interface SkillExchangeModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

const SkillExchangeModal: React.FC<SkillExchangeModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
}) => {
	if (!isOpen) return null;

	return (
		<div className={styles.overlay} onClick={onClose}>
			<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
				<div className={styles.iconContainer}>
					<NotificationIcon className={styles.icon} />
				</div>

				<div className={styles.content}>
					<h2 className={styles.title}>Вы предложили обмен</h2>
					<p className={styles.subtitle}>
						Теперь дождитесь подтверждения. Вам придёт уведомление
					</p>
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

export default SkillExchangeModal;
