import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserCardData } from '@/entities/user/user';
import { Button } from '@/shared/ui/button';
import HeartOutlineIcon from '@/shared/assets/icons/heart-outline.svg?react';
import HeartOutlineDarkIcon from '@/shared/assets/icons/heart-outline-dark.svg?react';
import HeartFilledIcon from '@/shared/assets/icons/heart-filled.svg?react';
import styles from './SkillCard.module.css';
import { useTheme } from '@/app/styles/ThemeProvider';

function getAgeSuffix(age: number): string {
	const lastDigit = age % 10;
	const lastTwoDigits = age % 100;

	if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return 'лет';

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

interface SkillCardProps {
	user: UserCardData;
	onDetailsClick?: (userId: string) => void;
	onFavoriteToggle?: (userId: string, isFavorite: boolean) => void;
	hideActionButton?: boolean;
}

export const SkillCard: React.FC<SkillCardProps> = ({
	user,
	onDetailsClick,
	onFavoriteToggle,
	hideActionButton = false,
}) => {
	const [isFavorite, setIsFavorite] = useState(user.isFavorite || false);
	useEffect(() => {
		setIsFavorite(user.isFavorite || false);
	}, [user.isFavorite]);
	const { theme } = useTheme();
	const navigate = useNavigate();

	const handleFavoriteClick = () => {
		const newFavoriteState = !isFavorite;
		setIsFavorite(newFavoriteState);
		onFavoriteToggle?.(user.id, newFavoriteState);
	};

	const handleDetailsClick = () => {
		navigate(`/skills/${user.id}`);
		onDetailsClick?.(user.id);
	};

	const getSkillTagColor = (skillName: string): string => {
		// Бизнес и карьера
		const businessSkills = [
			'Управление командой',
			'Маркетинг и реклама',
			'Продажи и переговоры',
			'Личный бренд',
			'Резюме и собеседование',
			'Тайм-менеджмент',
			'Проектное управление',
			'Предпринимательство',
			'Бизнес-план',
		];

		// Творчество и искусство
		const artSkills = [
			'Рисование и иллюстрация',
			'Фотография',
			'Видеомонтаж',
			'Музыка и звук',
			'Актёрское мастерство',
			'Креативное письмо',
			'Арт-терапия',
			'Декор и DIY',
			'Игра на барабанах',
		];

		// Иностранные языки
		const languageSkills = [
			'Английский язык',
			'Испанский язык',
			'Французский язык',
			'Немецкий язык',
			'Китайский язык',
			'Японский язык',
			'Подготовка к экзаменам (IELTS, TOEFL)',
		];

		// Образование и развитие
		const educationSkills = [
			'Личностное развитие',
			'Навыки обучения',
			'Когнитивные техники',
			'Скорочтение',
			'Навыки преподавания',
			'Коучинг',
			'Медитация',
		];

		// Дом и уют
		const homeSkills = [
			'Уборка и организация',
			'Домашние финансы',
			'Приготовление еды',
			'Домашние растения',
			'Ремонт',
			'Хранение вещей',
			'Интерьер',
		];

		// Здоровье и лайфстайл
		const lifestyleSkills = [
			'Йога и медитация',
			'Питание и ЗОЖ',
			'Ментальное здоровье',
			'Осознанность',
			'Физические тренировки',
			'Сон и восстановление',
			'Баланс жизни и работы',
		];

		if (businessSkills.includes(skillName)) {
			return 'var(--color-tag-business)';
		}
		if (artSkills.includes(skillName)) {
			return 'var(--color-tag-art)';
		}
		if (languageSkills.includes(skillName)) {
			return 'var(--color-tag-languages)';
		}
		if (educationSkills.includes(skillName)) {
			return 'var(--color-tag-education)';
		}
		if (homeSkills.includes(skillName)) {
			return 'var(--color-tag-home)';
		}
		if (lifestyleSkills.includes(skillName)) {
			return 'var(--color-tag-lifestyle)';
		}

		// Для неизвестных навыков используем цвет "прочее"
		return 'var(--color-tag-more)';
	};

	const renderSkillTags = (skills: string[], maxVisible = 3) => {
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
						style={{ backgroundColor: 'var(--color-tag-more)' }}
					>
						+{hiddenCount}
					</span>
				)}
			</div>
		);
	};

	return (
		<div className={styles.card}>
			<div className={styles.userSection}>
				<div className={styles.avatar}>
                                        <img
                                                src={user.avatarUrl}
                                                alt={`Фото ${user.name}`}
                                                className={styles.avatarImage}
                                                loading='lazy'
                                        />
				</div>

				<div className={styles.userInfo}>
					<h3 className={styles.userName}>{user.name}</h3>
					<p className={styles.userLocation}>
						{user.location}, {user.age} {getAgeSuffix(user.age)}
					</p>
				</div>

				<button
					className={styles.favoriteButton}
					onClick={handleFavoriteClick}
					aria-label={
						isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'
					}
				>
					{isFavorite ? (
						<HeartFilledIcon />
					) : theme === 'dark' ? (
						<HeartOutlineDarkIcon />
					) : (
						<HeartOutlineIcon />
					)}
				</button>
			</div>
			{hideActionButton && user.description && (
				<div className={styles.userDescription}>
					<p>{user.description}</p>
				</div>
			)}
			<div className={styles.skillsSection}>
				<div className={styles.skillGroup}>
					<h4 className={styles.skillGroupTitle}>Может научить:</h4>
					{renderSkillTags(user.skillsCanTeach, 1)}
				</div>

				<div className={styles.skillGroup}>
					<h4 className={styles.skillGroupTitle}>Хочет научиться:</h4>
					{renderSkillTags(user.skillsWantToLearn, 2)}
				</div>

				{!hideActionButton && (
					<Button
						className={
							user.isExchangeSent ? styles.exchangeButton : styles.detailsButton
						}
						onClick={handleDetailsClick}
						variant={user.isExchangeSent ? 'outlined' : 'primary'}
						fullWidth
					>
						{user.isExchangeSent ? 'Обмен предложен' : 'Подробнее'}
					</Button>
				)}
			</div>
		</div>
	);
};
