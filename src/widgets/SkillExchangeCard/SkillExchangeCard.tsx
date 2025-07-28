import style from './SkillExchangeCard.module.css';
import { useState } from 'react';
import emptyHeartIcon from '../../shared/assets/icons/heart-outline.svg';
import filledHeartIcon from '../../shared/assets/icons/heart-filled.svg';
import moreSquareIcon from '../../shared/assets/icons/more-square.svg';
import shareIcon from '../../shared/assets/icons/share.svg';

export type TSkillExchangeCard = {
	user: {
		id: string;
		name: string;
		avatarUrl: string;
		location: string;
		age: number;
		description?: string;
		skillsCanTeach: string[];
		skillsWantToLearn: string[];
	};
	skill: {
		id: string;
		title: string;
		category: string;
		description: string;
		images?: string[];
	};
};

/**
 * Карточка обмена навыками (для отображения на странице предложения)
 */
export const SkillExchangeCard = ({ user, skill }: TSkillExchangeCard) => {
	const [isFavorite, setIsFavorite] = useState(false);

	/**
	 * Переключить состояние избранного
	 */
	const toggleFavorite = () => {
		setIsFavorite(!isFavorite);
	};

	return (
		<div className={style.card}>
			{/* Левая часть — информация о пользователе */}
			<div className={style.userSection}>
				<div className={style.avatarWrapper}>
					<img
						src={user.avatarUrl}
						className={style.avatar}
						alt={`Фото ${user.name}`}
					/>
				</div>

				<h3 className={style.userName}>{user.name}</h3>
				<p className={style.userLocation}>
					{user.location}, {user.age} года
				</p>

				{user.description && (
					<p className={style.userDescription}>{user.description}</p>
				)}

				{/* Список навыков, которыми пользователь может поделиться */}
				<div className={style.skillGroup}>
					<h4 className={style.skillGroupTitle}>Может научить</h4>
					<div className={style.skillTags}>
						{user.skillsCanTeach.map((skill, index) => (
							<span key={index} className={style.skillTag}>
								{skill}
							</span>
						))}
					</div>
				</div>

				{/* Список навыков, которые пользователь хочет изучить */}
				<div className={style.skillGroup}>
					<h4 className={style.skillGroupTitle}>Хочет научиться</h4>
					<div className={style.skillTags}>
						{user.skillsWantToLearn.map((skill, index) => (
							<span key={index} className={style.skillTag}>
								{skill}
							</span>
						))}
					</div>
				</div>
			</div>

			{/* Правая часть — описание навыка и изображения */}
			<div className={style.skillSection}>
				{/* Кнопки в правом верхнем углу */}
				<div className={style.headerButtons}>
					<button className={style.iconButton} onClick={toggleFavorite}>
						<img
							src={isFavorite ? filledHeartIcon : emptyHeartIcon}
							className={style.iconButton}
							alt={isFavorite ? 'В избранном' : 'Добавить в избранное'}
						/>
					</button>
					<button className={style.iconButton}>
						<img
							src={shareIcon}
							className={style.iconButton}
							alt='Поделиться'
						/>
					</button>
					<button className={style.iconButton}>
						<img src={moreSquareIcon} className={style.iconButton} alt='Еще' />
					</button>
				</div>

				{/* Название и описание навыка */}
				<div className={style.descriptionBlock}>
					<h2 className={style.skillTitle}>{skill.title}</h2>
					<p className={style.skillSubtitle}>{skill.category}</p>
					<p className={style.skillDescription}>{skill.description}</p>
				</div>

				{/* Кнопка обмена */}
				<button className={`${style.button} ${style.primaryButton}`}>
					Предложить обмен
				</button>

				{/* Галерея изображений */}
				{skill.images && skill.images.length > 0 && (
					<div className={style.imageGallery}>
						<img
							src={skill.images[0]}
							className={style.mainImage}
							alt={skill.title}
						/>
						<div className={style.sideImages}>
							{skill.images.slice(1, 4).map((img, idx) => (
								<div className={style.smallImageWrapper} key={idx}>
									<img
										src={img}
										className={style.smallImage}
										alt={`${skill.title} - фото ${idx + 1}`}
									/>
									{idx === 2 && skill.images && skill.images.length > 4 && (
										<div className={style.imageCounter}>
											+{skill.images.length - 4}
										</div>
									)}
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
