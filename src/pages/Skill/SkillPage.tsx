import styles from './SkillPage.module.css';
import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import type { UserCardData, UserDetailData } from '@/entities/user/user';
import { SkillExchangeCard } from '@/widgets/SkillExchangeCard/SkillExchangeCard';
import { SkillCard } from '@/widgets/SkillCard/SkillCard';
import arrow from '../../shared/assets/icons/chevron-right.svg';
import { SkillsAPI } from '@/api/skills.api';

const cardsPerPage = 4;

export const SkillPage = () => {
	const { id } = useParams<{ id: string }>();

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

	if (isLoading) return <div className={styles.content}>Загрузка...</div>; // в идеале заменить на прелоадер
	if (error) return <div className={styles.content}>{error}</div>;
	if (!currentUser || !currentUserOffer)
		return <div className={styles.content}>Пользователь не найден</div>;

	const skill = {
		id: currentUserOffer.id,
		title: currentUserOffer.skillsCanTeach[0].title,
		category: currentUserOffer.skillsCanTeach[0].category,
		description: currentUserOffer.skillsCanTeach[0].description,
		images: currentUserOffer.skillsCanTeach[0].images,
	};

	const handleExchangeSent = () => {
		if (id) {
			setAllUsers((prev) =>
				prev.map((u) => (u.id === id ? { ...u, isExchangeSent: true } : u))
			);
		}
	};

	return (
		<div className={styles.content}>
			<div className={styles.currentOffer}>
				<SkillCard
					user={{
						...currentUser!,
						description: currentUserOffer.description,
					}}
					hideActionButton
				/>
				<SkillExchangeCard
					userId={currentUser.id}
					skill={skill}
					onExchangeSent={handleExchangeSent}
					showExchangeButton={isLoggedIn}
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
								<img src={arrow} alt='Следующая страница' />
							</button>
						)}

						<section className={styles.offersList}>
							{visibleOffers.map((filteredOffers) => (
								<SkillCard key={filteredOffers.id} user={filteredOffers} />
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
