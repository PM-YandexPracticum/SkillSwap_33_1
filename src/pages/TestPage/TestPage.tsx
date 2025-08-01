// import styles from './TestPage.module.css';
import FavoritesList from '@/widgets/FavoritesUsersList/FavoritesUsersList';
import { useEffect, useState } from 'react';
import Loader from '@/shared/ui/loader/Loader';
import UserCardsList from '@/widgets/UserCardsList/UserCardsList';
import { useDispatch } from '@/app/providers/store/StoreProvider';
import { getAllUsersApi, type IUserApi } from '@/api/favorites.api';
import { asyncThunkGetUsersAddedIntoFavorites } from '@/entities/slices/favoritesSlice';
import { useFavoriteUsers } from '@/shared/hooks';

export const TestPage = () => {
	const [allUsers, setAllUsers] = useState<IUserApi[]>([]);
	const dispatch = useDispatch();

	// hook для favoriteUsers (можно использовать вручную и без него через useSelector)
	const { isLoading, isInitialLoaded } = useFavoriteUsers();
	// пример использования store.favorites без hook useFavoriteUsers
	// const isLoading = useSelector((state) => state.favorites.isLoading);
	// const isInitialLoaded = useSelector(
	// 	(state) => state.favorites.isInitialLoaded
	// );
	// const favoriteUsers = useSelector((state) => state.favorites.favoriteUsers);

	useEffect(() => {
		// вызывается один раз на верхнем уровне (на странице) для загрузки юзеров из LocalStorage и отправки api запроса для получения данных пользователей
		dispatch(asyncThunkGetUsersAddedIntoFavorites());

		// для теста получаем всех юзеров из фейк-бд
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
				<h4 className='heading-main'>Страница для тестов</h4>
				<p>Пример использования пользователей с карточками</p>
				<UserCardsList users={allUsers} />
			</div>

			<div>
				<h4 className='heading-main'>Избранное</h4>
				<p>Пользователи в избранном</p>
				<FavoritesList />
			</div>
		</>
	);
};
