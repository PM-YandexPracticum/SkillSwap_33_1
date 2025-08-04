import styles from './SkillExchangeCard.module.css';
import { useState } from 'react';
import EmptyHeartIcon from '../../shared/assets/icons/heart-outline.svg?react';
import FilledHeartIcon from '../../shared/assets/icons/heart-filled.svg?react';
import MoreSquareIcon from '../../shared/assets/icons/more-square.svg?react';
import ShareIcon from '../../shared/assets/icons/share.svg?react';
import SkillExchangeModal from './SkillExchangeModal';
import { addSentRequest, getSentRequests } from '@/api/requests.api';


export type TSkillExchangeCard = {
	skill: {
		id: string;
		title: string;
		category: string;
		description: string;
		images?: string[];
	};
	userId: string;
	showHeaderButtons?: boolean;
	showPopupHeader?: boolean;
	showExchangeButton?: boolean;
	showEditButtons?: boolean;
	popUpTitle?: string;
	popUpSubtitle?: string;
	onExchangeSent?: () => void;
	isUserLoggedIn?: boolean;
};

export const SkillExchangeCard = ({
	skill,
	userId,
	showHeaderButtons = true,
	showPopupHeader = false,
	showExchangeButton = true,
	showEditButtons = false,
	popUpTitle,
	popUpSubtitle,
	onExchangeSent,
	isUserLoggedIn = false,
}: TSkillExchangeCard) => {
	const [isFavorite, setIsFavorite] = useState(false);
	const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);
	const [hasSentRequest, setHasSentRequest] = useState(() =>
		getSentRequests().includes(userId)
	);


	const toggleFavorite = () => {
		setIsFavorite(!isFavorite);
	};

	const handleExchangeClick = () => {
		setIsExchangeModalOpen(true);
	};

	const handleConfirmExchange = () => {
		addSentRequest(userId);
		setHasSentRequest(true);
		onExchangeSent?.();
		setIsExchangeModalOpen(false);
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

					{showExchangeButton && (
						<button
							className={`${styles.button} ${
								hasSentRequest || !isUserLoggedIn
									? styles.disabledButton
									: styles.primaryButton
							}`}
							onClick={
								hasSentRequest || !isUserLoggedIn
									? undefined
									: handleExchangeClick
							}
							disabled={hasSentRequest || !isUserLoggedIn}
						>
							{hasSentRequest ? 'Обмен предложен' : 'Предложить обмен'}
						</button>
					)}

					{showEditButtons && (
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
								/>
							)}
							{skill.images.length > 1 && (
								<>
									<img
										src={skill.images[0]}
										className={styles.image}
										alt={skill.title}
									/>
									{skill.images.slice(1, 4).map((img, idx) => (
										<div className={styles.smallImageWrapper} key={idx}>
											<img
												src={img}
												className={styles.image}
												alt={skill.title}
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
