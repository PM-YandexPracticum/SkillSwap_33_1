import clsx from 'clsx';
import styles from './UserCard.module.css';
import type { IUserCardProps } from './UserCard.props';
import { Button } from '@/shared/ui/button';
import HeartIcon from '@shared/assets/icons/heart.svg?react';
import ClockIcon from '@shared/assets/icons/clock.svg?react';
import HeartFilledIcon from '@shared/assets/icons/heart-filled.svg?react';
import { useNavigate } from 'react-router-dom';
import { APP_SETTINGS } from '@/shared/constants/global_constants';
import { Card } from '@/shared/ui/card/Card';
import UserCardTagsList from './UserCardTagsList/UserCardTagsList';
import { useSelector } from '@/app/providers/store/StoreProvider';
import { isUserLiked } from '@/entities/slices/favoritesSlice';
import { useTheme } from '@/app/styles/ThemeProvider';

// функция helper склонения слов возраста лет/года/год getRuUserAgeСonjugation({age?: number; birthday?: string;}) - логика склонения не реализована
// пример использования getRuUserAgeСonjugation({ birthday: '2004-02-15' }) => 21 год
// или
// getRuUserAgeСonjugation({ age: 26 }) => 26 лет

// APP_SETTINGS.paths.userProfilePage(user.id) - собирает путь на страницу навыка

// путь к картинке пользователя, если у пользователя фотография отсутствует
const defaultUserProfileImage =
	'/assets/images/profile-pictures/no-profile-picture-icon.svg';

export const CardUser = ({
	user,
	isExchangeSent = false,
	displayMode = 'default',
	maxUserSkillsTagsShown = 1,
	maxUserSkillsWantsToLearnTagsShown = 2,
	className,
	onLikeButtonClicked,
	onMoreCardButtonClick,
	onExchangeCardButtonClick,
	...props
}: IUserCardProps) => {
	const { theme } = useTheme();
	const isLiked = useSelector((state) =>
		isUserLiked(state, { payload: user.id, type: '' })
	);

	const navigate = useNavigate();

	function handleLikeButtonClickHandler() {
		if (onLikeButtonClicked) {
			onLikeButtonClicked(isLiked);
		}
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
						alt={user.name}
						draggable='false'
						loading='lazy'
					/>
					<div className={styles.userInfoBlock}>
						{displayMode === 'default' && (
							<button
								onClick={handleLikeButtonClickHandler}
								className={styles.likeButton}
								aria-label={isLiked ? 'Убрать лайк' : 'Поставить лайк'}
								onKeyDown={(event) => {
									if (event.key === 'Enter') handleLikeButtonClickHandler;
								}}
							>
								{isLiked ? (
									<HeartFilledIcon />
								) : (
									<HeartIcon
										fill={
											theme === 'light'
												? 'var(--color-text)'
												: 'var(--color-accent)'
										}
									/>
								)}
							</button>
						)}
						<div className={styles.userInfoWrapper}>
							<div className={styles.userInfoName}>{user.name}</div>
							<div className={styles.userInfoMore}>
								{user.location}, {user.age}
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
				<UserCardTagsList
					maxTagsShown={maxUserSkillsTagsShown}
					tags={
						user.skillsCanTeach &&
						Array.isArray(user.skillsCanTeach) &&
						user.skillsCanTeach.length > 0
							? user.skillsCanTeach
							: []
					}
					headingTitle='Может научить:'
				/>
				<UserCardTagsList
					maxTagsShown={maxUserSkillsWantsToLearnTagsShown}
					tags={
						user.skillsWantsToLearn &&
						Array.isArray(user.skillsWantsToLearn) &&
						user.skillsWantsToLearn.length > 0
							? user.skillsWantsToLearn
							: []
					}
					headingTitle='Хочет научиться:'
				/>
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
