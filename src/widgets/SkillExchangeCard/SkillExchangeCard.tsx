import styles from './SkillExchangeCard.module.css';
import { useEffect, useState } from 'react';
import EmptyHeartIcon from '../../shared/assets/icons/heart-outline.svg?react';
import FilledHeartIcon from '../../shared/assets/icons/heart-filled.svg?react';
import MoreSquareIcon from '../../shared/assets/icons/more-square.svg?react';
import ShareIcon from '../../shared/assets/icons/share.svg?react';
import SkillExchangeModal from './SkillExchangeModal';
import {
	createExchangeRequest,
	getSentRequests,
	getReceivedRequests,
	updateRequestStatus,
	findMutualSkills,
	hasInProgressExchange,
} from '@/api/requests.api';
import { getCurrentUser } from '@/features/auth/AuthForm.model';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@/shared/lib/toast';

export type TSkillExchangeCard = {
	skill: {
		id: string;
		subcategoryId?: number;
		title: string;
		category: string;
		description: string;
		images?: string[];
	};
	userId: string;
	showHeaderButtons?: boolean;
	showPopupHeader?: boolean;
	showExchangeButton?: boolean;
	showEditButton?: boolean;
	showRegistrationButtons?: boolean;
	popUpTitle?: string;
	popUpSubtitle?: string;
	onExchangeSent?: () => void;
	onFavoriteToggle?: (userId: string, isFavorite: boolean) => void;
	isUserLoggedIn?: boolean;
	onStatusChange?: () => void;
};

export const SkillExchangeCard = ({
	skill,
	userId,
	showHeaderButtons = false,
	showPopupHeader = false,
	showExchangeButton = false,
	showEditButton = false,
	showRegistrationButtons = false,
	popUpTitle,
	popUpSubtitle,
	onExchangeSent,
	onFavoriteToggle,
	isUserLoggedIn = false,
	onStatusChange,
}: TSkillExchangeCard) => {
	const [isFavorite, setIsFavorite] = useState(false);
	const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);
	const [hasSentRequest, setHasSentRequest] = useState(() =>
		getSentRequests().includes(userId)
	);
	const [hasReceivedRequest, setHasReceivedRequest] = useState(() =>
		getReceivedRequests().includes(userId)
	);
	const [pendingMatch, setPendingMatch] = useState<{
		offered: number;
		requested: number;
	} | null>(null);
	const [hasActiveExchange, setHasActiveExchange] = useState(() =>
		hasInProgressExchange(userId)
	);

	const navigate = useNavigate();
	const location = useLocation();

	const toggleFavorite = () => {
		const newFavoriteState = !isFavorite;
		setIsFavorite(newFavoriteState);
		onFavoriteToggle?.(userId, newFavoriteState);
	};

	const currentUser = getCurrentUser();

	useEffect(() => {
		setHasActiveExchange(hasInProgressExchange(userId));
	}, [userId]);

	const handleExchangeClick = () => {
		if (!isUserLoggedIn) {
			navigate('/login', {
				state: { from: location.pathname },
			});
			return;
		}
		const skillId = skill.subcategoryId ?? Number(skill.id);
		if (Number.isNaN(skillId)) {
			toast.error('Навык не найден');
			return;
		}
		const match = findMutualSkills(userId, skillId);
		if (!match) {
			toast.error('Нет взаимного навыка для обмена');
			return;
		}
		setPendingMatch(match);
		setIsExchangeModalOpen(true);
	};

	const handleConfirmExchange = () => {
		if (!pendingMatch) return;
		createExchangeRequest(userId, pendingMatch.offered, pendingMatch.requested);
		setHasSentRequest(true);
		onExchangeSent?.();
		setIsExchangeModalOpen(false);
	};

	const handleAcceptExchange = () => {
		if (!currentUser?.id) return;
		updateRequestStatus(userId, `usr_${currentUser.id}`, 'inProgress');
		setHasReceivedRequest(false);
		setHasSentRequest(false);
		toast.success('Заявка принята');
		setHasActiveExchange(true);
		onStatusChange?.();
	};

	const handleRejectExchange = () => {
		if (!currentUser?.id) return;
		updateRequestStatus(userId, `usr_${currentUser.id}`, 'rejected');
		setHasReceivedRequest(false);
		setHasSentRequest(false);
		toast.error('Заявка отклонена');
		onStatusChange?.();
	};

	return (
		<div className={styles.card}>
			{showHeaderButtons && (
				<div className={styles.headerButtons}>
					<button className={styles.favoriteButton} onClick={toggleFavorite}>
						{isFavorite ? (
							<FilledHeartIcon className={styles.iconButton} />
						) : (
							<EmptyHeartIcon className={styles.iconButton} />
						)}
					</button>
					<button className={styles.favoriteButton}>
						<ShareIcon className={styles.iconButton} />
					</button>
					<button className={styles.favoriteButton}>
						<MoreSquareIcon className={styles.iconButton} />
					</button>
				</div>
			)}

			{showPopupHeader && (
				<div className={styles.header}>
					<div className={styles.popUpTitle}>{popUpTitle}</div>
					<div className={styles.popUpSubtitle}>{popUpSubtitle}</div>
				</div>
			)}

			<div className={styles.cardContent}>
				<div className={styles.textBlock}>
					<div className={styles.descriptionBlock}>
						<div className={styles.textHeader}>
							<h3 className={styles.skillTitle}>{skill.title}</h3>
							<p className={styles.skillSubtitle}>{skill.category}</p>
						</div>
						<p className={styles.skillDescription}>{skill.description}</p>
					</div>

					{showExchangeButton &&
						(hasActiveExchange ? (
							<button
								className={`${styles.button} ${styles.disabledButton}`}
								disabled
							>
								Обмен в процессе
							</button>
						) : hasReceivedRequest ? (
							<div className={styles.buttonsBlock}>
								<button
									className={`${styles.button} ${styles.primaryButton}`}
									onClick={handleAcceptExchange}
								>
									Принять обмен
								</button>
								<button
									className={`${styles.button} ${styles.secondaryButton}`}
									onClick={handleRejectExchange}
								>
									Отклонить
								</button>
							</div>
						) : (
							<button
								className={`${styles.button} ${
									hasSentRequest ? styles.disabledButton : styles.primaryButton
								}`}
								onClick={hasSentRequest ? undefined : handleExchangeClick}
								disabled={hasSentRequest}
							>
								{hasSentRequest ? 'Обмен предложен' : 'Предложить обмен'}
							</button>
						))}

					{showEditButton && (
						<div className={styles.buttonsBlock}>
							<button
								className={`${styles.button} ${styles.secondaryButton}`}
								onClick={() => {}}
							>
								Редактировать
							</button>
						</div>
					)}

					{showRegistrationButtons && (
						<div className={styles.buttonsBlock}>
							<button
								className={`${styles.button} ${styles.secondaryButton}`}
								onClick={() => {}}
							>
								Редактировать
							</button>
							<button
								className={`${styles.button} ${styles.primaryButton}`}
								onClick={() => {}}
							>
								Готово
							</button>
						</div>
					)}
				</div>

				<div className={styles.imageBlock}>
					{Array.isArray(skill.images) && skill.images.length > 0 && (
						<div className={styles.imageGrid}>
							{skill.images.length === 1 && (
								<img
									src={skill.images[0]}
									className={styles.image}
									alt={skill.title}
									loading='lazy'
								/>
							)}
							{skill.images.length > 1 && (
								<>
									<img
										src={skill.images[0]}
										className={styles.image}
										alt={skill.title}
										loading='lazy'
									/>
									{skill.images.slice(1, 4).map((img, idx) => (
										<div className={styles.smallImageWrapper} key={idx}>
											<img
												src={img}
												className={styles.image}
												alt={skill.title}
												loading='lazy'
											/>
											{idx === 2 && (skill.images?.length ?? 0) > 4 && (
												<div className={styles.imageCounter}>
													+{(skill.images?.length ?? 0) - 4}
												</div>
											)}
										</div>
									))}
								</>
							)}
						</div>
					)}
				</div>
			</div>

			<SkillExchangeModal
				isOpen={isExchangeModalOpen}
				onClose={() => setIsExchangeModalOpen(false)}
				onConfirm={handleConfirmExchange}
			/>
		</div>
	);
};
