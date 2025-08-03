import React from 'react';
import type { UserCardData } from '@/entities/user/user';
import { SkillCard } from './SkillCard';
import ChevronRightIcon from '@/shared/assets/icons/chevron-right.svg?react';
import styles from './SkillSection.module.css';

interface SkillSectionProps {
	title: string;
	users: UserCardData[];
	showViewAllButton?: boolean;
	onViewAllClick?: () => void;
	onCardDetailsClick?: (userId: string) => void;
	onFavoriteToggle?: (userId: string, isFavorite: boolean) => void;
	isLoadingMore?: boolean;
}

export const SkillSection: React.FC<SkillSectionProps> = ({
	title,
	users,
	showViewAllButton = false,
	onViewAllClick,
	onCardDetailsClick,
	onFavoriteToggle,
	isLoadingMore,
}) => {
	const handleViewAllClick = () => {
		onViewAllClick?.();
	};

	return (
		<section className={styles.section}>
			<div className={styles.sectionHeader}>
				<h2 className={styles.sectionTitle}>{title}</h2>
				{showViewAllButton && (
					<button
						className={styles.viewAllButton}
						onClick={handleViewAllClick}
						aria-label={`Смотреть все в разделе ${title}`}
					>
						<span className={styles.viewAllText}>Смотреть все</span>
						<ChevronRightIcon className={styles.viewAllIcon} />
					</button>
				)}
			</div>

			<div className={styles.cardsContainer}>
				{users.map((user) => (
					<SkillCard
						key={user.id}
						user={user}
						onDetailsClick={onCardDetailsClick}
						onFavoriteToggle={onFavoriteToggle}
					/>
				))}
			</div>

			{isLoadingMore && (
				<div className={styles.loadingMore}>
					<div className={styles.loadingSpinnerSmall} />
					<p>Загрузка...</p>
				</div>
			)}
		</section>
	);
};
