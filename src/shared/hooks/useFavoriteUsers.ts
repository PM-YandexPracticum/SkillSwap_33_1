import { useDispatch, useSelector } from '@/app/providers/store/StoreProvider';
import { asyncThunkGetUsersAddedIntoFavorites } from '@/entities/slices/favoritesSlice';

// Как использовать
// const {зедсь достаются свойства/методы} = useFavoriteUsers();
// const {favoriteUsers, isLoading и т.д} = useFavoriteUsers();
// favoriteUsers - пользователи которые в избранном типа IUserApi[]
// isLoading - состояние загрузки (загружаются ли щас пользователи)
// favoriteUsersIds - ids: string[] массив с ids пользователей в избранном
// isUserLiked - метод проверки, лайкнут ли пользователью. параметры метода => (userId: string)
// isInitialLoaded - производилась ли уже первоначальная загрузка пользователей true/false
// initializeAndLoadFavoriteUsers - метод нужен для загрузки пользователей из localStorage и
// выполнения api запроса на получение данных избранных пользователей. используется при render страницы/компонента, если надо получить favoriteUsers
// по умолчанию вызывается в компоненте FavoritesUsersList (если используется он, то вызывать initializeAndLoadFavoriteUsers не нужно)

export const useFavoriteUsers = () => {
	const dispatch = useDispatch();

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

	function loadFavoriteUsers() {
		dispatch(asyncThunkGetUsersAddedIntoFavorites());
	}

	return {
		initializeAndLoadFavoriteUsers: loadFavoriteUsers,
		favoriteUsers: localStorageUsers,
		isLoading,
		favoriteUsersIds,
		isUserLiked,
		isInitialLoaded,
	};
};
