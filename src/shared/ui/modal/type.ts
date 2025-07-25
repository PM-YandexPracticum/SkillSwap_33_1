export type TModalUIProps = {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	message: string;
	icon: string;
	buttonText?: string; // Добавляем возможность кастомизации текста кнопки
	onButtonClick?: () => void; // Добавляем обработчик клика по кнопке
};
