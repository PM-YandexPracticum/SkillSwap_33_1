import { useState, useEffect, useCallback, useRef } from 'react';
import type { UserCardData } from '@/entities/user/user';
import { SkillsAPI } from '@/api/skills.api';
import { SkillSection } from '@/widgets/SkillCard/SkillSection';
import styles from './HomePage.module.css';

export const HomePage = () => {
	const [popularUsers, setPopularUsers] = useState<UserCardData[]>([]);
	const [newUsers, setNewUsers] = useState<UserCardData[]>([]);
	const [recommendedUsers, setRecommendedUsers] = useState<UserCardData[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [hasMoreRecommended, setHasMoreRecommended] = useState(true);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const observerRef = useRef<IntersectionObserver | null>(null);
	const loadMoreRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const loadInitialData = async () => {
			try {
				setIsLoading(true);
				setError(null);

				const [popular, newUsersData, recommended] = await Promise.all([
					SkillsAPI.getPopularUsers(),
					SkillsAPI.getNewUsers(),
					SkillsAPI.getRecommendedUsers({ offset: 0, limit: 6 }),
				]);

				setPopularUsers(popular);
				setNewUsers(newUsersData);
				setRecommendedUsers(recommended);
				setHasMoreRecommended(recommended.length === 6);
			} catch (err) {
				console.error('Ошибка при загрузке данных:', err);
				setError('Не удалось загрузить данные. Попробуйте обновить страницу.');
			} finally {
				setIsLoading(false);
			}
		};

		loadInitialData();
	}, []);

	const loadMoreRecommended = useCallback(async () => {
		if (!hasMoreRecommended || isLoadingMore) return;

		try {
			setIsLoadingMore(true);

			const offset = recommendedUsers.length;
			const newUsers = await SkillsAPI.getRecommendedUsers({
				offset,
				limit: 20,
			});

			if (newUsers.length === 0) {
				setHasMoreRecommended(false);
				return;
			}

			setRecommendedUsers((prev) => [...prev, ...newUsers]);
			setHasMoreRecommended(newUsers.length === 20);
		} catch (err) {
			console.error('Ошибка при загрузке дополнительных данных:', err);
		} finally {
			setIsLoadingMore(false);
		}
	}, [recommendedUsers.length, hasMoreRecommended, isLoadingMore]);

	useEffect(() => {
		if (!loadMoreRef.current) return;

		const target = loadMoreRef.current;

		const observerCallback = (entries: IntersectionObserverEntry[]) => {
			const [entry] = entries;
			if (entry.isIntersecting && hasMoreRecommended && !isLoadingMore) {
				loadMoreRecommended();
			}
		};

		observerRef.current = new IntersectionObserver(observerCallback, {
			root: null,
			rootMargin: '20px',
			threshold: 0.1,
		});

		observerRef.current.observe(target);

		return () => {
			if (observerRef.current) {
				observerRef.current.unobserve(target);
			}
		};
	}, [loadMoreRecommended, hasMoreRecommended, isLoadingMore]);

	const handleViewAllPopular = () => {
		console.log('Переход к странице всех популярных пользователей');
	};

	const handleViewAllNew = () => {
		console.log('Переход к странице всех новых пользователей');
	};

	const handleCardDetailsClick = (userId: string) => {
		console.log('Переход к профилю пользователя:', userId);
	};

	const handleFavoriteToggle = (userId: string, isFavorite: boolean) => {
		console.log(
			'Изменение избранного для пользователя:',
			userId,
			'Новое состояние:',
			isFavorite
		);
	};

	if (isLoading && recommendedUsers.length === 0) {
		return (
			<div className={styles.loadingContainer}>
				<div className={styles.loadingSpinner} />
				<p className={styles.loadingText}>Загрузка данных...</p>
			</div>
		);
	}

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
			<SkillSection
				title='Популярное'
				users={popularUsers}
				showViewAllButton={true}
				onViewAllClick={handleViewAllPopular}
				onCardDetailsClick={handleCardDetailsClick}
				onFavoriteToggle={handleFavoriteToggle}
			/>

			<SkillSection
				title='Новое'
				users={newUsers}
				showViewAllButton={true}
				onViewAllClick={handleViewAllNew}
				onCardDetailsClick={handleCardDetailsClick}
				onFavoriteToggle={handleFavoriteToggle}
			/>

			<SkillSection
				title='Рекомендуем'
				users={recommendedUsers}
				showViewAllButton={false}
				onCardDetailsClick={handleCardDetailsClick}
				onFavoriteToggle={handleFavoriteToggle}
				isLoadingMore={isLoadingMore}
			/>

			<div
				ref={loadMoreRef}
				style={{ height: '10px', width: '100%' }}
				aria-hidden='true'
			/>

			{isLoadingMore && (
				<div className={styles.loadingMore}>
					<div className={styles.loadingSpinnerSmall} />
					<p>Загрузка...</p>
				</div>
			)}

			{!hasMoreRecommended && !isLoadingMore && (
				<div className={styles.noMoreResults}>
					Вы просмотрели все рекомендации
				</div>
			)}
		</div>
	);
};
