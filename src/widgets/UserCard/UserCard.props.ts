import type { DetailedHTMLProps, HTMLAttributes } from 'react';

type UserCardPropsType = DetailedHTMLProps<
	HTMLAttributes<HTMLDivElement>,
	HTMLDivElement
>;

export interface IUserCard {
	id: string;
	name: string;
	avatarUrl?: string;
	age: string;
	location: string;
	description?: string;
	skillsCanTeach: IUserCardSkill[];
	skillsWantsToLearn: IUserCardSkill[];
}

export interface IUserCardSkill {
	name: string;
	type: number;
}

export type UserCardDisplayType = 'profile' | 'default';

export interface IUserCardProps extends UserCardPropsType {
	user: IUserCard;
	displayMode?: UserCardDisplayType;
	maxUserSkillsTagsShown?: number;
	maxUserSkillsWantsToLearnTagsShown?: number;
	isExchangeSent?: boolean;
	onLikeButtonClicked?: (isUserAdded: boolean) => void;
	onMoreCardButtonClick?: () => void;
	onExchangeCardButtonClick?: () => void;
}
