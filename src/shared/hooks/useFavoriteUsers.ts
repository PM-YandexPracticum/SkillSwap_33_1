import { useSelector } from '@/app/providers/store/StoreProvider';

export const useFavoriteUsers = () => {
	const localStorageUsers = useSelector(
		(state) => state.favorites.favoriteUsers
	);

	const favoriteUsersIds = useSelector(
		(state) => state.favorites.favoriteUsersIds
	);

	const isInitialLoaded = useSelector(
		(state) => state.favorites.isInitialLoaded
	);

	const isLoading = useSelector((state) => state.favorites.isLoading);

	function isUserLiked(userId: string) {
		return favoriteUsersIds.includes(userId);
	}

	return {
		favoriteUsers: localStorageUsers,
		isLoading,
		isUserLiked,
		isInitialLoaded,
	};
};
