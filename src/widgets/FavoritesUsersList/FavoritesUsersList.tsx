import type { IFavoritesUsersListProps } from './FavoritesUsersList.props.ts';
import styles from './FavoritesUsersList.module.css';
import { Link } from 'react-router-dom';
import Loader from '@/shared/ui/loader/Loader.tsx';
import UserCardsList from '@/widgets/UserCardsList/UserCardsList.tsx';
import { useFavoriteUsers } from '@/shared/hooks/index.ts';

const FavoritesUsersList = ({ ...props }: IFavoritesUsersListProps) => {
	const { isLoading, isInitialLoaded, favoriteUsers } = useFavoriteUsers();

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
