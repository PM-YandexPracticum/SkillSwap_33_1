import type { IFavoritesUsersListProps } from './FavoritesUsersList.props.ts';
import styles from './FavoritesUsersList.module.css';
import { Link } from 'react-router-dom';
import Loader from '@/shared/ui/loader/Loader.tsx';
import UserCardsList from '@/widgets/UserCardsList/UserCardsList.tsx';
import { useFavoriteUsers } from '@/shared/hooks/index.ts';
import { useDispatch } from '@/app/providers/store/StoreProvider.tsx';
import { useEffect } from 'react';
import { asyncThunkGetUsersAddedIntoFavorites } from '@/entities/slices/favoritesSlice.ts';

const FavoritesUsersList = ({ ...props }: IFavoritesUsersListProps) => {
	const dispatch = useDispatch();
	const { isLoading, isInitialLoaded, favoriteUsers } = useFavoriteUsers();

	useEffect(() => {
		// вызывается один раз для загрузки избранных юзеров из LocalStorage и отправки api запроса на получение данных пользователей
		dispatch(asyncThunkGetUsersAddedIntoFavorites());
	}, []);

	if (isLoading && !isInitialLoaded) {
		return <Loader />;
	}

	if (!favoriteUsers || favoriteUsers.length === 0) {
		return (
			<div className={styles.emptyWrapper}>
				<div className='heading-main'>Ваш список избранного пуст</div>
				<Link className='link' to={'/'}>
					Начни поиск пользователей здесь
				</Link>
			</div>
		);
	}

	return <UserCardsList users={favoriteUsers} {...props} />;
};

export default FavoritesUsersList;
