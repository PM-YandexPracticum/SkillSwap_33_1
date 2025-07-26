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
	buttonText = 'Готово', // Значение по умолчанию
	onButtonClick, // Новый пропс
}) => {
	if (!isOpen) return null;

	const handleButtonClick = () => {
		if (onButtonClick) {
			onButtonClick(); // Если передан обработчик, вызываем его
		} else {
			onClose(); // Иначе просто закрываем модальное окно
		}
	};

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
				<Button fullWidth={true} onClick={handleButtonClick}>
					{buttonText}
				</Button>
			</div>
		</div>
	);
};

// Пример использования в другом компоненте
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ModalUI } from './ui-kit/modal';

// const SomeComponent = () => {
//   const [isModalOpen, setIsModalOpen] = useState(true);
//   const navigate = useNavigate();

//   const handleClose = () => {
//     setIsModalOpen(false);
//   };

//   const handleRedirect = () => {
//     setIsModalOpen(false);
//     navigate('/next-step'); // Редирект на нужную страницу
//   };

//   return (
//     <ModalUI
//       isOpen={isModalOpen}
//       onClose={handleClose}
//       title="Успех!"
//       message="Операция выполнена успешно"
//       icon="/success-icon.png"
//       buttonText="Перейти дальше"
//       onButtonClick={handleRedirect}
//     />
//   );
// };
