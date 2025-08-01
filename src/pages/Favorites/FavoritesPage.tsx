import { asyncThunkGetUsersAddedIntoFavorites } from '@/entities/slices/favoritesSlice';
import FavoritesList from '@/widgets/FavoritesUsersList/FavoritesUsersList';
import { useEffect } from 'react';
import { useDispatch } from '@/app/providers/store/StoreProvider';

export const FavoritesPage = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		// вызывается один раз на верхнем уровне (на странице) для загрузки избранных юзеров из LocalStorage и api запроса для получения данных пользователей
		dispatch(asyncThunkGetUsersAddedIntoFavorites());
	}, [dispatch]);

	return (
		<>
			<h1 className='heading-main'>Избранное</h1>
			<FavoritesList />
		</>
	);
};
