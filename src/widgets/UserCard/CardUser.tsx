import clsx from 'clsx';
import styles from './CardUser.module.css';
import type { ICardUserProps } from './CardUser.props';
import { Button } from '@/shared/ui/button';
import HeartIcon from '@shared/assets/icons/heart-outline.svg?react';
import ClockIcon from '@shared/assets/icons/clock.svg?react';
import { getRuUserAgeСonjugation } from '@/shared/lib/user-formating-helpers';
import { useState } from 'react';
import HeartFilledIcon from '@shared/assets/icons/heart-filled.svg?react';
import { useNavigate } from 'react-router-dom';
import { APP_SETTINGS } from '@/shared/constants/global_constants';
import type { SkillCategoriesType } from '@/shared/ui/tag/Tag.props';
import { Card } from '@/shared/ui/card/Card';
import { Tag } from '@/shared/ui/tag/Tag';

// Описание компонента
// prop displayMode = default (значение по умолчанию включает в себя кнопку лайка и кнопку подробнее), profile (кнопок нет, но добавляется описание пользователя)
// prop isExchangeSent = отправлен ли запрос на обмен текущему пользователю (по умолчанию нет)
// prop onMoreCardButtonClick = функция на клик по кнопке подробнее, если функция не задана, то при нажатии ведет по url на страницу пользователя
// prop onExchangeCardButtonClick = функция на клик по кнопке подробнее в состоянии запрос на обмен добавлен (по умолчанию действий нет)
// prop showAllTags = показывать все навыки которые хочет изучить пользователь или нет (по умолчанию нет)

// функция helper склонения слов возраста лет/года/год getRuUserAgeСonjugation({age?: number; birthday?: string;}) - логика склонения не реализована
// пример использования getRuUserAgeСonjugation({ birthday: '2004-02-15' }) => 21 год
// или
// getRuUserAgeСonjugation({ age: 26 }) => 26 лет

// APP_SETTINGS.paths.userProfilePage(user.id) - собирает путь на страницу пользователя

// для настройки и корректного отображения цветов Tags поменять очередность категорий (индекс 0 => BusinessAndCareer, ...,  индекс 6 => HidedSkills)
const SkillsColors: Array<SkillCategoriesType> = [
	'HidedSkills', // UserSkill->categoryId === 0
	'BusinessAndCareer', // UserSkill->categoryId === 1
	'CreativityAndArt', // UserSkill->categoryId === 2
	'ForeignLanguages', // UserSkill->categoryId === 3
	'EducationAndDevelopment', // UserSkill->categoryId === 4
	'HomeAndComfort', // UserSkill->categoryId === 5
	'HealthAndLifestyle', // UserSkill->categoryId === 6
] as const;

// путь к картинке пользователя, если у пользователя фотография отсутствует
const defaultUserProfileImage =
	'/assets/images/profile-pictures/no-profile-picture-icon.svg';

export const CardUser = ({
	user,
	isExchangeSent = false,
	displayMode = 'default',
	showAllTags = false,
	className,
	onMoreCardButtonClick,
	onExchangeCardButtonClick,
	...props
}: ICardUserProps) => {
	// использовать hook useFavorite для работы с добавлением/удалением из избранного
	const [isUserLiked, setIsUserLiked] = useState<boolean>(false);
	const navigate = useNavigate();

	function handleLikeButtonClickHandler() {
		setIsUserLiked(() => !isUserLiked);
	}

	function onMoreButtonClickHandler() {
		if (onMoreCardButtonClick) {
			onMoreCardButtonClick();
		} else {
			navigate(APP_SETTINGS.paths.userProfilePage(user.id));
		}
	}

	function onExchangeButtonClickHandler() {
		if (onExchangeCardButtonClick) {
			onExchangeCardButtonClick();
		}
	}

	return (
		<Card
			className={clsx(className, styles.card, {
				[styles.cardDefault]: displayMode === 'default',
			})}
			{...props}
		>
			<div className={styles.headerWrapper}>
				<div className={styles.headerUserInfoWrapper}>
					<img
						className={styles.profilePicture}
						src={
							user.avatarUrl && user.avatarUrl.trim()
								? user.avatarUrl
								: defaultUserProfileImage
						}
						alt='user 3'
						draggable='false'
					/>
					<div className={styles.userInfoBlock}>
						{displayMode === 'default' && (
							<button
								onClick={handleLikeButtonClickHandler}
								className={styles.likeButton}
								aria-label={isUserLiked ? 'Убрать лайк' : 'Поставить лайк'}
								onKeyDown={(event) => {
									if (event.key === 'Enter') handleLikeButtonClickHandler;
								}}
							>
								{isUserLiked ? <HeartFilledIcon /> : <HeartIcon />}
							</button>
						)}
						<div>
							<div className={styles.userInfoName}>{user.name}</div>
							<div className={styles.userInfoMore}>
								{user.location},{' '}
								{getRuUserAgeСonjugation({ birthday: '2004-02-15' })}
							</div>
						</div>
					</div>
				</div>
				{displayMode === 'profile' && (
					<p className={styles.userDescriptionText}>{user.description}</p>
				)}
			</div>
			<div className={styles.bodyWrapper}>
				{/* не обрабатывался вариант, если skillCanTeach === string , а не array*/}
				{user.skillCanTeach &&
					Array.isArray(user.skillCanTeach) &&
					user.skillCanTeach.length > 0 && (
						<div className={styles.tagsWrapper}>
							<h3 className={styles.tagTitle}>Может научить:</h3>
							<ul className={styles.tagsList}>
								{user.skillCanTeach.map((skill) => (
									<li key={skill.categoryId} className={styles.tagItem}>
										<Tag
											backgroundColorTemplate={SkillsColors[skill.categoryId]}
										>
											{skill.skill}
										</Tag>
									</li>
								))}
							</ul>
						</div>
					)}

				{/* не обрабатывался вариант, если subcategoriesWantToLearn === string , а не array*/}
				{user.subcategoriesWantToLearn &&
					Array.isArray(user.subcategoriesWantToLearn) &&
					user.subcategoriesWantToLearn.length > 0 && (
						<div className={styles.tagsWrapper}>
							<h3 className={styles.tagTitle}>Хочет научиться:</h3>
							<ul className={styles.tagsList}>
								{user.subcategoriesWantToLearn.map((skill, index) => {
									if (!showAllTags && displayMode === 'default') {
										if (index <= 1) {
											return (
												<>
													<li key={skill.categoryId} className={styles.tagItem}>
														<Tag
															backgroundColorTemplate={
																SkillsColors[skill.categoryId]
															}
														>
															{skill.skill}
														</Tag>
													</li>
												</>
											);
										} else if (
											index ===
											user.subcategoriesWantToLearn.length - 1
										) {
											return (
												<li key={skill.categoryId} className={styles.tagItem}>
													<Tag backgroundColorTemplate={'HidedSkills'}>
														+{user.subcategoriesWantToLearn.length - 2}
													</Tag>
												</li>
											);
										}
									} else {
										return (
											<li key={skill.categoryId} className={styles.tagItem}>
												<Tag
													backgroundColorTemplate={
														SkillsColors[skill.categoryId]
													}
												>
													{skill.skill}
												</Tag>
											</li>
										);
									}
								})}
							</ul>
						</div>
					)}
			</div>
			{displayMode === 'default' && (
				<div className={styles.footerWrapper}>
					{isExchangeSent ? (
						<Button
							variant='outlined'
							className={clsx(styles.button, styles.buttonExchange)}
							onClick={onExchangeButtonClickHandler}
						>
							<>
								<ClockIcon />
								<span>Обмен предложен</span>
							</>
						</Button>
					) : (
						<Button
							onClick={onMoreButtonClickHandler}
							className={styles.button}
						>
							Подробнее
						</Button>
					)}
				</div>
			)}
		</Card>
	);
};
