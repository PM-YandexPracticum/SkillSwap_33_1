import { useState, useEffect, useMemo } from 'react';
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
import {
	selectFilters,
	setGender,
	setType,
	toggleCity,
	toggleSkill,
	unmarkCategorySkills,
} from '../../entities/slices/filtersSlice';
import { selectAllSkills } from '../../entities/slices/skillsSlice';
/**
 * Главная страница приложения
 * Отображает секции с карточками навыков: Популярное, Новое, Рекомендуем
 */
export const HomePage = () => {
	const skills = useAppSelector(selectAllSkills);
	const filters = useAppSelector(selectFilters);
	const dispatch = useAppDispatch();
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
					SkillsAPI.getRecommendedUsers(),
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
			case 'skillCategory':
				{
					const category = skills.find((c) => c.id === Number(filter.id));
					if (category) {
						const skillIdsToRemove = category.skills.map((s) => s.id);
						dispatch(unmarkCategorySkills(skillIdsToRemove));
					}
				}

				break;
			case 'skill':
				dispatch(toggleSkill(Number(filter.id)));
				break;
		}
	};

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
		console.log(
			'Изменение избранного для пользователя:',
			userId,
			'Новое состояние:',
			isFavorite
		);
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
		<div className={styles.main}>
			<FilterBar />

			<div className={styles.homePage}>
				<ActiveFilters
					filters={ActiveFilterButtons}
					onRemoveTag={handleRemoveFilter}
				/>

				{/* Секция "Популярное" */}
				<SkillSection
					title='Популярное'
					users={popularUsers}
					showViewAllButton={true}
					onViewAllClick={handleViewAllPopular}
					onCardDetailsClick={handleCardDetailsClick}
					onFavoriteToggle={handleFavoriteToggle}
				/>

				{/* Секция "Новое" */}
				<SkillSection
					title='Новое'
					users={newUsers}
					showViewAllButton={true}
					onViewAllClick={handleViewAllNew}
					onCardDetailsClick={handleCardDetailsClick}
					onFavoriteToggle={handleFavoriteToggle}
				/>

				{/* Секция "Рекомендуем" */}
				<SkillSection
					title='Рекомендуем'
					users={recommendedUsers}
					showViewAllButton={false}
					onCardDetailsClick={handleCardDetailsClick}
					onFavoriteToggle={handleFavoriteToggle}
				/>
			</div>
		</div>
	);
};
