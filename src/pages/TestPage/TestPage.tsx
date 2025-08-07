import { useEffect, useState } from 'react';
import { useDispatch } from '@/app/providers/store/StoreProvider';
import { getAllUsersApi, type IUserApi } from '@/api/favorites.api';
import { useFavoriteUsers } from '@/shared/hooks';
import UserCardsList from '@/widgets/UserCardsList/UserCardsList';
import FavoritesUsersList from '@/widgets/FavoritesUsersList/FavoritesUsersList';
import Loader from '@/shared/ui/loader/Loader';
import Input from '@/shared/ui/inputs/input/Input';
import { Button } from '@/shared/ui/button';
import ButtonIcon from '@/shared/ui/ButtonIcon/ButtonIcon';
import AppleIcon from '@shared/assets/icons/clock.svg?react';
import HeartIcon from '@shared/assets/icons/heart-outline.svg?react';
import HeartFilledIcon from '@shared/assets/icons/heart-filled.svg?react';
import styles from './TestPage.module.css';
import InputSelect from '@/shared/ui/inputs/select/InputSelect';

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
			<h4 className='heading-main'>Страница для тестов</h4>
			<div>
				<p
					style={{
						marginTop: '60px',
						marginBottom: '12px',
						fontSize: '20px',
						fontWeight: 600,
						padding: '20px 60px',
						border: '2px solid green',
						borderRadius: '12px',
						width: 'fit-content',
					}}
				>
					Пример использования пользователей с карточками
				</p>
				<UserCardsList users={allUsers} />
			</div>

			<div>
				<p
					style={{
						marginTop: '60px',
						marginBottom: '12px',
						fontSize: '20px',
						fontWeight: 600,
						padding: '20px 60px',
						border: '2px solid green',
						borderRadius: '12px',
						width: 'fit-content',
					}}
				>
					Пользователи в избранном
				</p>
				<h4 className='heading-main'>Избранное</h4>
				<FavoritesUsersList />
			</div>

			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: '24px',
					marginTop: '40px',
				}}
			>
				<section>
					<p
						style={{
							marginTop: '60px',
							marginBottom: '12px',
							fontSize: '20px',
							fontWeight: 600,
							padding: '20px 60px',
							border: '2px solid green',
							borderRadius: '12px',
							width: 'fit-content',
						}}
					>
						Примеры FormInput
					</p>
					<form
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: '8px',
							width: '50%',
						}}
					>
						<Input labelTitle='Имя' placeholder='Введите имя' />
						<Input
							labelTitle='Пароль'
							placeholder='Введите пароль'
							type='password'
						/>
						<Input
							labelTitle='Имя'
							placeholder='Введите имя'
							inputError={{
								errorType: 'error',
								message: 'Пароль должен содержать не менее 8 знаков',
							}}
						/>
						<Input
							showTooltipIcon={false}
							labelTitle='Имя'
							placeholder='Введите имя'
							inputError={{
								errorType: 'warning',
								message: 'Пароль должен содержать не менее 8 знаков',
							}}
						/>
						<Input
							tooltipIcon={<AppleIcon width={24} height={24} />}
							labelTitle='Имя'
							placeholder='Введите имя'
							inputError={{
								errorType: 'none',
								message: 'Пароль должен содержать не менее 8 знаков',
							}}
						/>
						<Button>Submit</Button>
					</form>
				</section>

				<section>
					<p
						style={{
							marginTop: '60px',
							marginBottom: '12px',
							fontSize: '20px',
							fontWeight: 600,
							padding: '20px 60px',
							border: '2px solid green',
							borderRadius: '12px',
							width: 'fit-content',
						}}
					>
						Пример ButtonIcon
					</p>
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

			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: '8px',
					marginTop: '40px',
				}}
			>
				<p
					style={{
						marginTop: '60px',
						marginBottom: '12px',
						fontSize: '20px',
						fontWeight: 600,
						padding: '20px 60px',
						border: '2px solid green',
						borderRadius: '12px',
						width: 'fit-content',
					}}
				>
					Пример Select
				</p>

				<InputSelect
					selectTitle='Город'
					options={[
						{
							label: 'Санкт-Петербург',
							value: '0',
						},
						{
							label: 'Москва',
							value: '1',
						},
						{
							label: 'Воронеж',
							value: '2',
						},
						{
							label: 'Самара',
							value: '3',
						},
					]}
					placeholder={'Не указан'}
				/>
				<InputSelect
					selectTitle='Пол'
					isSearchable={false}
					options={[
						{
							label: 'Не указан',
							value: '0',
						},
						{
							label: 'Мужской',
							value: '1',
						},
						{
							label: 'Женский',
							value: '2',
						},
					]}
					placeholder={'Не указан'}
				/>
				<InputSelect
					isMulti={true}
					selectTitle='Город'
					options={[
						{
							label: 'Санкт-Петербург',
							value: '0',
						},
						{
							label: 'Москва',
							value: '1',
						},
						{
							label: 'Воронеж',
							value: '2',
						},
						{
							label: 'Самара',
							value: '3',
						},
					]}
					placeholder={'Выберите категорию'}
				/>
				<InputSelect
					selectTitle='Категория навыка, которому хотите научиться'
					isMulti={true}
					options={[
						{ value: '1', label: 'Бизнес и карьера' },
						{ value: '2', label: 'Творчество и искусство' },
						{ value: '3', label: 'Иностранные языки' },
						{ value: '4', label: 'Здоровье и лайфстайл' },
						{ value: '5', label: 'Дом и уют' },
					]}
					selectType='checkboxes'
					placeholder='Выберите опции'
					onChange={(selected) => {
						console.log(`Выбраны: ${selected}`);
					}}
				/>
			</div>
		</>
	);
};

export default TestPage;
