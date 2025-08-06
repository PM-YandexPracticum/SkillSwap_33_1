import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { UserCardData } from '@/entities/user/user';
import { SkillsAPI } from '@/api/skills.api';
import { SkillSection } from '@/widgets/SkillCard/SkillSection';
import styles from './HomePage.module.css';
import FilterBar from '@/components/FilterBar/FilterBar';
import { ActiveFilters } from '@/shared/ui/ActiveFilters/ActiveFilters';
import type { ActiveFilterButton } from '@/shared/ui/ActiveFilters/types.ts';
import {
	useAppDispatch,
	useAppSelector,
} from '../../app/providers/store/hooks';
import { useFavoriteUsers } from '@/shared/hooks';
import { asyncThunkSetLikeUserState } from '@/entities/slices/favoritesSlice';
import {
	selectFilters,
	setGender,
	setType,
	toggleCity,
	toggleSkill,
	unmarkCategorySkills,
} from '../../entities/slices/filtersSlice';
import { selectAllSkills } from '../../entities/slices/skillsSlice';

export const HomePage = () => {
	const dispatch = useAppDispatch();
	const skills = useAppSelector(selectAllSkills);
	const filters = useAppSelector(selectFilters);

	const { favoriteUsersIds, initializeAndLoadFavoriteUsers } =
		useFavoriteUsers();

	const [popularUsers, setPopularUsers] = useState<UserCardData[]>([]);
	const [newUsers, setNewUsers] = useState<UserCardData[]>([]);
	const [recommendedUsers, setRecommendedUsers] = useState<UserCardData[]>([]);

	const [isLoading, setIsLoading] = useState(true);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const [hasMoreRecommended, setHasMoreRecommended] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const observerRef = useRef<IntersectionObserver | null>(null);
	const loadMoreRef = useRef<HTMLDivElement>(null);

	const skillIdToName = useMemo(() => {
		const map = new Map<number, string>();
		skills.forEach((category) => {
			category.skills.forEach((skill) => {
				map.set(skill.id, skill.name);
			});
		});
		return map;
	}, [skills]);

	const filterUsers = useCallback(
		(users: UserCardData[]) => {
			return users.filter((user) => {
				if (
					filters.gender !== 'Не имеет значения' &&
					user.gender !== filters.gender
				) {
					return false;
				}

				if (
					filters.cities.length > 0 &&
					!filters.cities.includes(user.location)
				) {
					return false;
				}

				if (filters.skills.length > 0) {
					const selectedSkillNames = filters.skills
						.map((id) => skillIdToName.get(id))
						.filter(Boolean) as string[];

					const hasTeach = selectedSkillNames.some((name) =>
						user.skillsCanTeach.includes(name)
					);
					const hasLearn = selectedSkillNames.some((name) =>
						user.skillsWantToLearn.includes(name)
					);

					switch (filters.type) {
						case 'Могу научить':
							if (!hasTeach) return false;
							break;
						case 'Хочу научиться':
							if (!hasLearn) return false;
							break;
						default:
							if (!hasTeach && !hasLearn) return false;
					}
				}

				if (filters.search) {
					const search = filters.search.toLowerCase();
					const inName = user.name.toLowerCase().includes(search);
					const inSkills = [
						...user.skillsCanTeach,
						...user.skillsWantToLearn,
					].some((s) => s.toLowerCase().includes(search));
					if (!inName && !inSkills) return false;
				}

				return true;
			});
		},
		[filters, skillIdToName]
	);

	const filteredPopularUsers = useMemo(
		() => filterUsers(popularUsers),
		[popularUsers, filterUsers]
	);
	const filteredNewUsers = useMemo(
		() => filterUsers(newUsers),
		[newUsers, filterUsers]
	);
	const filteredRecommendedUsers = useMemo(
		() => filterUsers(recommendedUsers),
		[recommendedUsers, filterUsers]
	);

	useEffect(() => {
		initializeAndLoadFavoriteUsers();
	}, [initializeAndLoadFavoriteUsers]);

	const applyFavorites = useCallback(
		(users: UserCardData[]) =>
			users.map((u) => ({
				...u,
				isFavorite: favoriteUsersIds.includes(u.id),
			})),
		[favoriteUsersIds]
	);

	// Загрузка данных при монтировании
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

				setPopularUsers(applyFavorites(popular));
				setNewUsers(applyFavorites(newUsersData));
				setRecommendedUsers(applyFavorites(recommended));
				setHasMoreRecommended(recommended.length === 6);
			} catch (err) {
				console.error('Ошибка при загрузке данных:', err);
				setError('Не удалось загрузить данные. Попробуйте обновить страницу.');
			} finally {
				setIsLoading(false);
			}
		};

		loadInitialData();
	}, [applyFavorites]);

	useEffect(() => {
		setPopularUsers((prev) => applyFavorites(prev));
		setNewUsers((prev) => applyFavorites(prev));
		setRecommendedUsers((prev) => applyFavorites(prev));
	}, [applyFavorites]);

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

			const withFav = applyFavorites(newUsers);
			setRecommendedUsers((prev) => [...prev, ...withFav]);
			setHasMoreRecommended(newUsers.length === 20);
		} catch (err) {
			console.error('Ошибка при загрузке дополнительных данных:', err);
		} finally {
			setIsLoadingMore(false);
		}
	}, [
		recommendedUsers.length,
		hasMoreRecommended,
		isLoadingMore,
		applyFavorites,
	]);

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

	const ActiveFilterButtons = useMemo((): ActiveFilterButton[] => {
		const tags: ActiveFilterButton[] = [];
		if (filters.type !== 'Всё') {
			tags.push({ id: 'type', type: 'type', label: filters.type });
		}
		if (filters.gender !== 'Не имеет значения') {
			tags.push({ id: 'gender', type: 'gender', label: filters.gender });
		}
		filters.cities.forEach((city) => {
			tags.push({ id: city, type: 'city', label: city });
		});

		const skillsSet = new Set(filters.skills);
		const checkedSkillIDs = new Set<string>();

		skills.forEach((category) => {
			const categorySkillIDs = category.skills.map((skill) => skill.id);
			const allSelected = categorySkillIDs.every((id) => skillsSet.has(id));

			if (allSelected && categorySkillIDs.length > 0) {
				tags.push({
					id: String(category.id),
					type: 'skillCategory',
					label: category.name,
				});
				categorySkillIDs.forEach((id) => checkedSkillIDs.add(String(id)));
			}
		});

		const _skills = skills.flatMap((category) => category.skills);
		filters.skills.forEach((id) => {
			if (!checkedSkillIDs.has(String(id))) {
				const skill = _skills.find((s) => s.id === id);
				if (skill) {
					tags.push({ id: String(id), type: 'skill', label: skill.name });
				}
			}
		});

		return tags;
	}, [filters, skills]);

	const handleRemoveFilter = (filter: ActiveFilterButton) => {
		switch (filter.type) {
			case 'type':
				dispatch(setType('Всё'));
				break;
			case 'gender':
				dispatch(setGender('Не имеет значения'));
				break;
			case 'city':
				dispatch(toggleCity(filter.id));
				break;
			case 'skillCategory': {
				const category = skills.find((c) => c.id === Number(filter.id));
				if (category) {
					const skillIdsToRemove = category.skills.map((s) => s.id);
					dispatch(unmarkCategorySkills(skillIdsToRemove));
				}
				break;
			}
			case 'skill':
				dispatch(toggleSkill(Number(filter.id)));
				break;
		}
	};

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
		dispatch(
			asyncThunkSetLikeUserState({
				userId,
				isLiked: !isFavorite,
			})
		);
		const updateList = (list: UserCardData[]) =>
			list.map((u) => (u.id === userId ? { ...u, isFavorite } : u));
		setPopularUsers((prev) => updateList(prev));
		setNewUsers((prev) => updateList(prev));
		setRecommendedUsers((prev) => updateList(prev));
		SkillsAPI.clearCache();
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
		<div className={styles.main}>
			<FilterBar />

			<div className={styles.homePage}>
				<ActiveFilters
					filters={ActiveFilterButtons}
					onRemoveTag={handleRemoveFilter}
				/>

				<SkillSection
					title='Популярное'
					users={filteredPopularUsers}
					showViewAllButton={true}
					onViewAllClick={handleViewAllPopular}
					onCardDetailsClick={handleCardDetailsClick}
					onFavoriteToggle={handleFavoriteToggle}
				/>

				<SkillSection
					title='Новое'
					users={filteredNewUsers}
					showViewAllButton={true}
					onViewAllClick={handleViewAllNew}
					onCardDetailsClick={handleCardDetailsClick}
					onFavoriteToggle={handleFavoriteToggle}
				/>

				<SkillSection
					title='Рекомендуем'
					users={filteredRecommendedUsers}
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
		</div>
	);
};
