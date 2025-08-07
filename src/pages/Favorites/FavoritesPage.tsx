import FavoritesList from '@/widgets/FavoritesUsersList/FavoritesUsersList';

export const FavoritesPage = () => {
	return (
		<>
			<h1 className='heading-main'>Избранное</h1>
			<FavoritesList />
		</>
	);
};

export default FavoritesPage;
