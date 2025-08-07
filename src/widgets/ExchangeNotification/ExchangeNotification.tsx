import type { UserCardData } from '@/entities/user/user';
import { useState } from 'react';
import styles from './ExchangeNotification.module.css';
import idea from '@/shared/assets/icons/idea.svg';
import cross from '@/shared/assets/icons/cross.svg';

type Props = {
	users: UserCardData[];
};

export const ExchangeNotificationPopup = ({ users }: Props) => {
	const [hiddenUserIds, setHiddenUserIds] = useState<string[]>([]);

	const visibleUsers = users.filter((user) => !hiddenUserIds.includes(user.id));

	const handleClose = (userId: string) => {
		setHiddenUserIds((prev) => [...prev, userId]);
	};

	return (
		<ul className={styles.popupList}>
			{visibleUsers.map((user) => (
				<li key={user.id} className={styles.popupItem}>
					<img src={idea} alt='идея' />
					<span>{user.name} предлагает вам обмен</span>
					<button
						className={styles.closeButton}
						onClick={() => handleClose(user.id)}
						aria-label='Закрыть уведомление'
					>
						<img src={cross} alt='Закрыть' />
					</button>
				</li>
			))}
		</ul>
	);
};

export default ExchangeNotificationPopup;

