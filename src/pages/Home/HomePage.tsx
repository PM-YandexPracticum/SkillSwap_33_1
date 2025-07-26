import styles from './HomePage.module.css';
import ClockIcon from '@icons/clock.svg?react';
import EditIcon from '@icons/edit.svg?react';
import BookIcon from '@icons/book.svg?react';
import { useTheme } from '../../app/styles/ThemeProvider';
import { Button } from '@shared/ui/button';
import { useState } from 'react';
import { ModalUI } from '@shared/ui/modal';

export const HomePage = () => {
	const { theme } = useTheme();
	const [isModalOpen, setIsModalOpen] = useState(false);

	// Функции для открытия и закрытия модального окна
	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);

	// Устанавливаем изображения в зависимости от темы
	const error404Image =
		theme === 'dark'
			? 'assets/images/error-404-dark.svg'
			: 'assets/images/error-404-light.svg';

	const error500Image =
		theme === 'dark'
			? 'assets/images/error-500-dark.svg'
			: 'assets/images/error-500-light.svg';

	return (
		<>
			<h1 className={styles.heading}>Home Page</h1>
			<div>
				<img src='assets/icons/testIcon.svg' alt='' />
				<img src={error404Image} alt='Error 404' />
				<img src={error500Image} alt='Error 500' />
				<img src='assets/images/light-bulb.svg' alt='' />
			</div>
			<div>
				<a className={styles.link} href='#'>
					<ClockIcon className={styles.icon} />
				</a>
				<a className={styles.link} href='#'>
					<BookIcon className={styles.icon} />
				</a>
				<a className={styles.link} href='#'>
					<EditIcon className={styles.icon} />
				</a>
			</div>
			{/* Кнопка для открытия модального окна */}
			<div>
				<Button fullWidth onClick={openModal}>
					Подробнее
				</Button>
				{/* Модальное окно */}
				<ModalUI
					isOpen={isModalOpen}
					onClose={closeModal}
					title='Пример заголовка'
					message='Это сообщение в модальном окне'
					icon='/path/to/icon.png'
				/>
			</div>
		</>
	);
};
