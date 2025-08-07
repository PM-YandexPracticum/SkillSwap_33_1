import styles from './SkillPage.module.css';
import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { UserCardData, UserDetailData } from '@/entities/user/user';
import { SkillExchangeCard } from '@/widgets/SkillExchangeCard/SkillExchangeCard';
import { SkillCard } from '@/widgets/SkillCard/SkillCard';
import arrow from '../../shared/assets/icons/chevron-right.svg';
import { SkillsAPI } from '@/api/skills.api';
import { getCurrentUser } from '@/features/auth/AuthForm.model';
import { useAppDispatch } from '../../app/providers/store/hooks';
import { asyncThunkSetLikeUserState } from '@/entities/slices/favoritesSlice';

const cardsPerPage = 4;

export const SkillPage = () => {
	const { id } = useParams<{ id: string }>();
	const sessionUser = getCurrentUser();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const [allUsers, setAllUsers] = useState<UserCardData[]>([]);
	const [currentUserOffer, setCurrentUserOffer] =
		useState<UserDetailData | null>(null);

	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [offersListPage, setOffersListPage] = useState(0);

	const [isLoggedIn, setIsLoggedIn] = useState(() =>
		Boolean(localStorage.getItem('currentUser'))
	);

	useEffect(() => {
		const loadData = async () => {
			try {
				setIsLoading(true);
				setError(null);
				setOffersListPage(0);

				const [users] = await Promise.all([SkillsAPI.getUsers()]);
				setAllUsers(users);

				if (id) {
					const currentUserOffer = await SkillsAPI.getOfferById(id);
					setCurrentUserOffer(currentUserOffer);
				}
			} catch (err) {
				console.error('Ошибка при загрузке данных:', err);
				setError('Не удалось загрузить данные. Попробуйте обновить страницу.');
			} finally {
				setIsLoading(false);
			}
		};

		loadData();
	}, [id]);

	useEffect(() => {
		const updateAuth = () =>
			setIsLoggedIn(Boolean(localStorage.getItem('currentUser')));
		window.addEventListener('userUpdated', updateAuth);
		window.addEventListener('storage', updateAuth);
		return () => {
			window.removeEventListener('userUpdated', updateAuth);
			window.removeEventListener('storage', updateAuth);
		};
	}, []);

	const currentUser = useMemo(() => {
		return allUsers.find((u) => u.id === id);
	}, [allUsers, id]);

	const filteredOffers = useMemo(() => {
		if (!currentUser || !currentUserOffer) return [];

		const currentUserTitles = currentUserOffer.skillsCanTeach.map((skill) =>
			skill.title.toLowerCase()
		);

		return allUsers.filter(
			(offer) =>
				offer.id !== currentUser.id &&
				offer.skillsCanTeach.some((skillTitle) =>
					currentUserTitles.includes(skillTitle.toLowerCase())
				)
		);
	}, [allUsers, currentUser, currentUserOffer]);

	const totalPages = Math.ceil(filteredOffers.length / cardsPerPage);
	const startIndex = offersListPage * cardsPerPage;
	const visibleOffers = filteredOffers.slice(
		startIndex,
		startIndex + cardsPerPage
	);

	const handlePrev = () => setOffersListPage((p) => Math.max(p - 1, 0));
	const handleNext = () =>
		setOffersListPage((p) => Math.min(p + 1, totalPages - 1));

	useEffect(() => {
		if (
			!isLoading &&
			sessionUser &&
			id === `usr_${sessionUser.id}` &&
			currentUserOffer &&
			currentUserOffer.skillsCanTeach.length === 0
		) {
			navigate('/profile/skills');
		}
	}, [isLoading, sessionUser, id, currentUserOffer, navigate]);

	if (isLoading) return <div className={styles.content}>Загрузка...</div>;
	if (error) return <div className={styles.content}>{error}</div>;
	if (!currentUser || !currentUserOffer)
		return <div className={styles.content}>Пользователь не найден</div>;

	if (currentUserOffer.skillsCanTeach.length === 0)
		return sessionUser && id === `usr_${sessionUser.id}` ? null : (
			<div className={styles.content}>Навык не найден</div>
		);

	const primarySkill = currentUserOffer.skillsCanTeach[0];

	const skill = {
		id: String(primarySkill.subcategoryId),
		subcategoryId: primarySkill.subcategoryId,
		title: primarySkill.title,
		category: primarySkill.category,
		description: primarySkill.description,
		images: primarySkill.images,
	};

	const handleExchangeSent = () => {
		if (id) {
			setAllUsers((prev) =>
				prev.map((u) => (u.id === id ? { ...u, isExchangeSent: true } : u))
			);
		}
	};

	const handleFavoriteToggle = (userId: string, isFavorite: boolean) => {
		dispatch(
			asyncThunkSetLikeUserState({
				userId,
				isLiked: !isFavorite,
			})
		);
		SkillsAPI.clearCache();
	};

	return (
		<div className={styles.content}>
			<div className={styles.currentOffer}>
				<SkillCard
					user={{
						...currentUser,
						description: currentUserOffer.description,
					}}
					hideActionButton
					hideFavoriteButton={true}
				/>
				<SkillExchangeCard
					userId={currentUser.id}
					skill={skill}
					onExchangeSent={handleExchangeSent}
					onFavoriteToggle={handleFavoriteToggle}
					showExchangeButton={
						!(sessionUser && `usr_${sessionUser.id}` === currentUser.id)
					}
					showHeaderButtons={true}
					isUserLoggedIn={isLoggedIn}
				/>
			</div>

			{filteredOffers.length > 0 && (
				<div className={styles.similarOffers}>
					<h2 className={styles.similarOffersTitle}>Похожие предложения</h2>

					<div className={styles.offersListWrapper}>
						{offersListPage > 0 && (
							<button
								className={`${styles.arrow} ${styles.arrowLeft}`}
								onClick={handlePrev}
							>
								<img src={arrow} alt='Предыдущая страница' />
							</button>
						)}

						<section className={styles.offersList}>
							{visibleOffers.map((offer) => (
								<SkillCard key={offer.id} user={offer} />
							))}
						</section>

						{offersListPage < totalPages - 1 && (
							<button
								className={`${styles.arrow} ${styles.arrowRight}`}
								onClick={handleNext}
							>
								<img src={arrow} alt='Следующая страница' />
							</button>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default SkillPage;
