import type { DetailedHTMLProps, HTMLAttributes } from 'react';
import type { IUserApi } from '@/api/favorites.api';

type UserCardsListPropsType = DetailedHTMLProps<
	HTMLAttributes<HTMLUListElement>,
	HTMLUListElement
>;

export interface IUserCardsListProps extends UserCardsListPropsType {
	users: IUserApi[];
	children?: React.ReactNode;
}
