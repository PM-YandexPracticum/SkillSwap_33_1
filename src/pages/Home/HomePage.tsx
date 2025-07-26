import styles from './HomePage.module.css';
import ClockIcon from '@icons/clock.svg?react';
import EditIcon from '@icons/edit.svg?react';
import BookIcon from '@icons/book.svg?react';
import { Button } from '@shared/ui/button';
import { useState } from 'react';
import { ModalUI } from '@shared/ui/modal';

export const HomePage = () => {
	{
		/* Проверка открытия модального окна при нажатии на кнопку*/
	}
	const [isModalOpen, setIsModalOpen] = useState(false);
	const openModal = () => {
		setIsModalOpen(true);
	};
	const closeModal = () => {
		setIsModalOpen(false);
	};

	return (
		<>
			<h1 className={styles.heading}>Home Page</h1>
			<div>
				<img src='assets/icons/testIcon.svg' alt='' />
				<img src='assets/images/error-404.svg' alt='' />
				<img src='assets/images/error-500.svg' alt='' />
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
			{/* Проверка открытия модального окна при нажатии на кнопку*/}
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
