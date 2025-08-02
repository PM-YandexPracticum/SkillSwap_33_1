import { useEffect, useState } from 'react';
import { useDispatch } from '@/app/providers/store/StoreProvider';
import { getAllUsersApi, type IUserApi } from '@/api/favorites.api';
import { useFavoriteUsers } from '@/shared/hooks';
import FavoritesList from '@/widgets/FavoritesUsersList/FavoritesUsersList';
import UserCardsList from '@/widgets/UserCardsList/UserCardsList';
import Loader from '@/shared/ui/loader/Loader';
import Input from '@/shared/ui/inputs/input/Input';
import { Button } from '@/shared/ui/button';
import ButtonIcon from '@/shared/ui/ButtonIcon/ButtonIcon';
import AppleIcon from '@shared/assets/icons/clock.svg?react';
import HeartIcon from '@shared/assets/icons/heart-outline.svg?react';
import HeartFilledIcon from '@shared/assets/icons/heart-filled.svg?react';
import styles from './TestPage.module.css';
const tempUsers = [
	{
		id: '1',
		name: 'Максим',
		location: 'Москва',
		gender: 'male',
		age: '23',
		description: 'Привет! Люблю ритм, кофе по утрам и людей, которые не боятся пробовать новое',
		avatarUrl: '/assets/images/profile-pictures/Image3.svg',
	},
	{
		id: '2',
		name: 'Виктория',
		location: 'Таджикистан',
		gender: 'female',
		age: '28',
		description: 'Люблю путешествовать и изучать новые языки.',
		avatarUrl: '/assets/images/profile-pictures/Image2.svg',
	},
];

export const TestPage = () => {
	const [allUsers, setAllUsers] = useState<IUserApi[]>([]);
	const dispatch = useDispatch();
	const { isLoading, isInitialLoaded } = useFavoriteUsers();

	useEffect(() => {
		async function getAllUsers() {
			const usersApi = await getAllUsersApi();
			setAllUsers(usersApi);
		}
		getAllUsers();
	}, [dispatch]);

	if (isLoading && !isInitialLoaded) {
		return <Loader />;
	}

	return (
		<>
			<div>
				<h4 className="heading-main">Страница для тестов</h4>
				<p>Пример использования пользователей с карточками</p>
				<UserCardsList users={allUsers} />
			</div>

			<div>
				<h4 className="heading-main">Избранное</h4>
				<p>Пользователи в избранном</p>
				<FavoritesList />
			</div>
			<div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '40px' }}>
				<section>
					<p>Примеры FormInput</p>
					<form
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: '8px',
							width: '50%',
						}}
					>
						<Input labelTitle="Имя" placeholder="Введите имя" />
						<Input labelTitle="Пароль" placeholder="Введите пароль" type="password" />
						<Input
							labelTitle="Имя"
							placeholder="Введите имя"
							inputError={{
								errorType: 'error',
								message: 'Пароль должен содержать не менее 8 знаков',
							}}
						/>
						<Input
							showTooltipIcon={false}
							labelTitle="Имя"
							placeholder="Введите имя"
							inputError={{
								errorType: 'warning',
								message: 'Пароль должен содержать не менее 8 знаков',
							}}
						/>
						<Input
							tooltipIcon={<AppleIcon width={24} height={24} />}
							labelTitle="Имя"
							placeholder="Введите имя"
							inputError={{
								errorType: 'none',
								message: 'Пароль должен содержать не менее 8 знаков',
							}}
						/>
						<Button>Submit</Button>
					</form>
				</section>

				<section>
					<p>Пример ButtonIcon</p>
					<ButtonIcon
						className={styles.iconButton}
						aria-label={true ? 'Убрать лайк' : 'Поставить лайк'}
						onClick={() => {
							console.log('clicked');
						}}
					>
						{false ? <HeartFilledIcon /> : <HeartIcon />}
					</ButtonIcon>
				</section>
			</div>
		</>
	);