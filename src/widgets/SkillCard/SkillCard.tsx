import React, { useState } from 'react';
import type { UserCardData } from '@/entities/user/user';
import { Button } from '@/shared/ui/button';
import { ModalUI } from '@/shared/ui/modal';
import HeartOutlineIcon from '@/shared/assets/icons/heart-outline.svg?react';
import HeartFilledIcon from '@/shared/assets/icons/heart-filled.svg?react';
import styles from './SkillCard.module.css';

/**
 * Получить правильное окончание для возраста
 * @param age - возраст
 * @returns строка с правильным окончанием
 */
function getAgeSuffix(age: number): string {
	const lastDigit = age % 10;
	const lastTwoDigits = age % 100;

	if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
		return 'лет';
	}

	switch (lastDigit) {
		case 1:
			return 'год';
		case 2:
		case 3:
		case 4:
			return 'года';
		default:
			return 'лет';
	}
}

/**
 * Пропсы для компонента SkillCard
 */
interface SkillCardProps {
	/** Данные пользователя для отображения в карточке */
	user: UserCardData;
	/** Обработчик клика по кнопке "Подробнее" */
	onDetailsClick?: (userId: string) => void;
	/** Обработчик изменения состояния избранного */
	onFavoriteToggle?: (userId: string, isFavorite: boolean) => void;
}

/**
 * Компонент карточки навыка
 * Отображает информацию о пользователе, его навыках и кнопки взаимодействия
 */
export const SkillCard: React.FC<SkillCardProps> = ({
	user,
	onDetailsClick,
	onFavoriteToggle,
}) => {
	// Состояние избранного для данной карточки
	const [isFavorite, setIsFavorite] = useState(user.isFavorite || false);
	// Состояние модального окна
	const [isModalOpen, setIsModalOpen] = useState(false);

	/**
	 * Обработчик клика по кнопке избранного
	 */
	const handleFavoriteClick = () => {
		const newFavoriteState = !isFavorite;
		setIsFavorite(newFavoriteState);
		onFavoriteToggle?.(user.id, newFavoriteState);
	};

	/**
	 * Обработчик клика по кнопке "Подробнее"
	 */
	const handleDetailsClick = () => {
		setIsModalOpen(true);
		onDetailsClick?.(user.id);
	};

	/**
	 * Обработчик закрытия модального окна
	 */
	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	/**
	 * Получить цвет фона для тега навыка
	 * @param skillName - название навыка
	 * @returns цвет фона в hex формате
	 */
	const getSkillTagColor = (skillName: string): string => {
		// Цветовая схема для разных категорий навыков
		const colorMap: Record<string, string> = {
			'Английский язык': '#EBE5C5', // Иностранные языки
			'Игра на барабанах': '#E7F2F6', // Творчество и искусство
			'Бизнес-план': '#E9F7E7', // Бизнес и карьера
			'Тайм-менеджмент': '#E7F2F6', // Образование и развитие
			Медитация: '#E9F7E7', // Здоровье и лайфстайл
		};

		return colorMap[skillName] || '#E8ECF7'; // Цвет по умолчанию
	};

	/**
	 * Отобразить теги навыков с ограничением по количеству
	 * @param skills - массив навыков
	 * @param maxVisible - максимальное количество видимых тегов
	 * @returns JSX элементы тегов
	 */
	const renderSkillTags = (skills: string[], maxVisible: number = 3) => {
		const visibleSkills = skills.slice(0, maxVisible);
		const hiddenCount = skills.length - maxVisible;

		return (
			<div className={styles.skillTags}>
				{visibleSkills.map((skill, index) => (
					<span
						key={index}
						className={styles.skillTag}
						style={{ backgroundColor: getSkillTagColor(skill) }}
					>
						{skill}
					</span>
				))}
				{hiddenCount > 0 && (
					<span
						className={styles.skillTag}
						style={{ backgroundColor: '#E8ECF7' }}
					>
						+{hiddenCount}
					</span>
				)}
			</div>
		);
	};

	return (
		<>
			<div className={styles.card}>
				{/* Секция пользователя */}
				<div className={styles.userSection}>
					{/* Аватар пользователя */}
					<div className={styles.avatar}>
						<img
							src={user.avatarUrl}
							alt={`Фото ${user.name}`}
							className={styles.avatarImage}
						/>
					</div>

					{/* Информация о пользователе */}
					<div className={styles.userInfo}>
						<h3 className={styles.userName}>{user.name}</h3>
						<p className={styles.userLocation}>
							{user.location}, {user.age} {getAgeSuffix(user.age)}
						</p>
					</div>

					{/* Кнопка избранного */}
					<button
						className={styles.favoriteButton}
						onClick={handleFavoriteClick}
						aria-label={
							isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'
						}
					>
						{isFavorite ? <HeartFilledIcon /> : <HeartOutlineIcon />}
					</button>
				</div>

				{/* Секция навыков и кнопки */}
				<div className={styles.skillsSection}>
					{/* Навыки, которые может преподавать */}
					<div className={styles.skillGroup}>
						<h4 className={styles.skillGroupTitle}>Может научить:</h4>
						{renderSkillTags(user.skillsCanTeach, 1)}
					</div>

					{/* Навыки, которые хочет изучить */}
					<div className={styles.skillGroup}>
						<h4 className={styles.skillGroupTitle}>Хочет научиться:</h4>
						{renderSkillTags(user.skillsWantToLearn, 2)}
					</div>

					{/* Кнопка "Подробнее" */}
					<Button
						className={styles.detailsButton}
						onClick={handleDetailsClick}
						fullWidth
					>
						Подробнее
					</Button>
				</div>
			</div>

			{/* Модальное окно с деталями пользователя */}
			<ModalUI
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				title={`Профиль ${user.name}`}
				message={`Подробная информация о пользователе ${user.name} из ${user.location}`}
				icon='/src/shared/assets/icons/user-circle.svg'
				buttonText='Закрыть'
			/>
		</>
	);
};
