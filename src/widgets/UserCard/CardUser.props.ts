import type { User } from '@/types';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';

type CardUserPropsType = DetailedHTMLProps<
	HTMLAttributes<HTMLDivElement>,
	HTMLDivElement
>;

export type CardUserDisplayType = 'profile' | 'default';

export interface ICardUserProps extends CardUserPropsType {
	user: User;
	displayMode?: CardUserDisplayType;
	showAllTags?: boolean;
	isExchangeSent?: boolean;
	onMoreCardButtonClick?: () => void;
	onExchangeCardButtonClick?: () => void;
}
