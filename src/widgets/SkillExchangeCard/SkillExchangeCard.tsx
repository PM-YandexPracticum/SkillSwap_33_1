import style from './SkillExchangeCard.module.css';
import { useState } from 'react';
import emptyHeartIcon from '../../shared/assets/icons/heart-outline.svg';
import filledHeartIcon from '../../shared/assets/icons/heart-filled.svg';
import moreSquareIcon from '../../shared/assets/icons/more-square.svg';
import shareIcon from '../../shared/assets/icons/share.svg';

export type TSkillExchangeCard = {
	skill: {
		id: string;
		title: string;
		categoty: string;
		description: string;
		images?: string[];
	};
	showHeaderButtons?: boolean;
	showPopupHeader?: boolean;
	showExchangeButton?: boolean;
	showEditBuutons?: boolean;
	popUpTitle?: string;
	popUpSubtitle?: string;
};

export const SkillExchangeCard = ({
	skill,
	showHeaderButtons = true,
	showPopupHeader = false,
	showExchangeButton = true,
	showEditBuutons = false,
	popUpTitle,
	popUpSubtitle,
}: TSkillExchangeCard) => {
	const [isFavorite, setIsFavorite] = useState(false);

	const toggleFavorite = () => {
		setIsFavorite(!isFavorite);
	};

	return (
		<div className={style.card}>
			{showHeaderButtons && (
				<div className={style.headerButtons}>
					<button className={style.favoriteButton} onClick={toggleFavorite}>
						{isFavorite ? (
							<img
								src={filledHeartIcon}
								className={style.iconButton}
								alt='В избранном'
							/>
						) : (
							<img
								src={emptyHeartIcon}
								className={style.iconButton}
								alt='Добавить в избранное'
							/>
						)}
					</button>
					<button className={style.favoriteButton} onClick={toggleFavorite}>
						<img
							src={shareIcon}
							className={style.iconButton}
							alt='Поделиться'
						/>
					</button>
					<button className={style.favoriteButton} onClick={toggleFavorite}>
						<img src={moreSquareIcon} className={style.iconButton} alt='Еще' />
					</button>
				</div>
			)}
			{showPopupHeader && (
				<div className={style.header}>
					<div className={style.popUpTitle}>{popUpTitle}</div>
					<div className={style.popUpSubtitle}>{popUpSubtitle}</div>
				</div>
			)}
			<div className={style.cardContent}>
				<div className={style.textBlock}>
					<div className={style.descriptionBlock}>
						<div className={style.textHeader}>
							<h3 className={style.skillTitle}>{skill.title}</h3>
							<p className={style.skillSubtitle}>{skill.categoty}</p>
						</div>
						<p className={style.skillDescription}>{skill.description}</p>
					</div>
					{showExchangeButton && (
						<button
							className={`${style.button} ${style.primaryButton}`}
							onClick={() => {}}
						>
							Предложить обмен
						</button>
					)}
					{showEditBuutons && (
						<div className={style.buttonsBlock}>
							<button
								className={`${style.button} ${style.secondaryButton}`}
								onClick={() => {}}
							>
								Редактировать
							</button>
							<button
								className={`${style.button} ${style.primaryButton}`}
								onClick={() => {}}
							>
								Готово
							</button>
						</div>
					)}
				</div>
				<div className={style.imageBlock}>
					{skill.images && (
						<div className={style.imageGrid}>
							{skill.images.length === 1 && (
								<img
									src={skill.images[0]}
									className={style.image}
									alt={skill.title}
								/>
							)}
							{skill.images.length > 1 && (
								<>
									<img
										src={skill.images[0]}
										className={style.image}
										alt={skill.title}
									/>
									{skill.images.slice(1, 4).map((img, idx) => (
										<div className={style.smallImageWrapper} key={idx}>
											<img
												src={img}
												className={style.image}
												alt={skill.title}
											/>
											{idx === 2 && (skill.images?.length ?? 0) > 4 && (
												<div className={style.imageCounter}>
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
		</div>
	);
};
