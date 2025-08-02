export interface IUserCardTagsListProps {
	headingTitle?: string;
	maxTagsShown?: number;
	tags: {
		name: string;
		type: number;
	}[];
}
