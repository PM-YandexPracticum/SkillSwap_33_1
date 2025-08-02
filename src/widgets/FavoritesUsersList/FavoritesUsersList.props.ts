import type { DetailedHTMLProps, HTMLAttributes } from 'react';

type FavoritesUsersListType = DetailedHTMLProps<
	HTMLAttributes<HTMLUListElement>,
	HTMLUListElement
>;

export interface IFavoritesUsersListProps extends FavoritesUsersListType {}
