import React, { useState } from 'react';
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
}

export const SkillCard: React.FC<SkillCardProps> = ({
	user,
	onDetailsClick,
	onFavoriteToggle,
}) => {
	const [isFavorite, setIsFavorite] = useState(user.isFavorite || false);
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
		const colorMap: Record<string, string> = {
			'Английский язык': 'var(--color-tag-languages)',
			'Игра на барабанах': 'var(--color-tag-art)',
			'Бизнес-план': 'var(--color-tag-business)',
			'Тайм-менеджмент': 'var(--color-tag-education)',
			'Йога и медитация': 'var(--color-tag-lifestyle)',
			Интерьер: 'var(--color-tag-home)',
			Прочее: 'var(--color-tag-more)',
		};

		return colorMap[skillName] || '#E8ECF7';
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

			<div className={styles.skillsSection}>
				<div className={styles.skillGroup}>
					<h4 className={styles.skillGroupTitle}>Может научить:</h4>
					{renderSkillTags(user.skillsCanTeach, 1)}
				</div>

				<div className={styles.skillGroup}>
					<h4 className={styles.skillGroupTitle}>Хочет научиться:</h4>
					{renderSkillTags(user.skillsWantToLearn, 2)}
				</div>

				<Button
					className={styles.detailsButton}
					onClick={handleDetailsClick}
					fullWidth
				>
					Подробнее
				</Button>
			</div>
		</div>
	);
};
