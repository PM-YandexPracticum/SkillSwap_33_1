import React, { useState, useEffect } from 'react';
import type { UserCardData } from '@/entities/user/user';
import { SkillsAPI } from '@/api/skills.api';
import { SkillSection } from '@/widgets/SkillCard/SkillSection';
import styles from './HomePage.module.css';

/**
 * Главная страница приложения
 * Отображает секции с карточками навыков: Популярное, Новое, Рекомендуем
 */
export const HomePage = () => {
	// Состояние для данных пользователей
	const [popularUsers, setPopularUsers] = useState<UserCardData[]>([]);
	const [newUsers, setNewUsers] = useState<UserCardData[]>([]);
	const [recommendedUsers, setRecommendedUsers] = useState<UserCardData[]>([]);
	
	// Состояние загрузки
	const [isLoading, setIsLoading] = useState(true);
	
	// Состояние ошибки
	const [error, setError] = useState<string | null>(null);

	/**
	 * Загрузка данных при монтировании компонента
	 */
	useEffect(() => {
		const loadData = async () => {
			try {
				setIsLoading(true);
				setError(null);

				// Загружаем данные для всех секций параллельно
				const [popular, newUsersData, recommended] = await Promise.all([
					SkillsAPI.getPopularUsers(),
					SkillsAPI.getNewUsers(),
					SkillsAPI.getRecommendedUsers()
				]);

				setPopularUsers(popular);
				setNewUsers(newUsersData);
				setRecommendedUsers(recommended);
			} catch (err) {
				console.error('Ошибка при загрузке данных:', err);
				setError('Не удалось загрузить данные. Попробуйте обновить страницу.');
			} finally {
				setIsLoading(false);
			}
		};

		loadData();
	}, []);

	/**
	 * Обработчик клика по кнопке "Смотреть все" для популярных
	 */
	const handleViewAllPopular = () => {
		console.log('Переход к странице всех популярных пользователей');
		// TODO: Реализовать навигацию к странице со всеми популярными пользователями
	};

	/**
	 * Обработчик клика по кнопке "Смотреть все" для новых
	 */
	const handleViewAllNew = () => {
		console.log('Переход к странице всех новых пользователей');
		// TODO: Реализовать навигацию к странице со всеми новыми пользователями
	};

	/**
	 * Обработчик клика по кнопке "Подробнее" в карточке
	 */
	const handleCardDetailsClick = (userId: string) => {
		console.log('Переход к профилю пользователя:', userId);
		// TODO: Реализовать навигацию к профилю пользователя
	};

	/**
	 * Обработчик изменения состояния избранного
	 */
	const handleFavoriteToggle = (userId: string, isFavorite: boolean) => {
		console.log('Изменение избранного для пользователя:', userId, 'Новое состояние:', isFavorite);
		// TODO: Реализовать сохранение состояния избранного
	};

	// Отображение состояния загрузки
	if (isLoading) {
		return (
			<div className={styles.loadingContainer}>
				<div className={styles.loadingSpinner} />
				<p className={styles.loadingText}>Загрузка данных...</p>
			</div>
		);
	}

	// Отображение ошибки
	if (error) {
		return (
			<div className={styles.errorContainer}>
				<p className={styles.errorText}>{error}</p>
				<button 
					className={styles.retryButton}
					onClick={() => window.location.reload()}
				>
					Попробовать снова
				</button>
			</div>
		);
	}

	return (
		<div className={styles.homePage}>
			{/* Секция "Популярное" */}
			<SkillSection
				title="Популярное"
				users={popularUsers}
				showViewAllButton={true}
				onViewAllClick={handleViewAllPopular}
				onCardDetailsClick={handleCardDetailsClick}
				onFavoriteToggle={handleFavoriteToggle}
			/>

			{/* Секция "Новое" */}
			<SkillSection
				title="Новое"
				users={newUsers}
				showViewAllButton={true}
				onViewAllClick={handleViewAllNew}
				onCardDetailsClick={handleCardDetailsClick}
				onFavoriteToggle={handleFavoriteToggle}
			/>

			{/* Секция "Рекомендуем" */}
			<SkillSection
				title="Рекомендуем"
				users={recommendedUsers}
				showViewAllButton={false}
				onCardDetailsClick={handleCardDetailsClick}
				onFavoriteToggle={handleFavoriteToggle}
			/>
		</div>
	);
};
