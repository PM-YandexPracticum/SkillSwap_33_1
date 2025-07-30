export interface IUserApi {
	id: string;
	name: string;
	avatarUrl: string;
	birthDate: string;
	genderId: string;
	locationId: string;
	description: string;
	createdAt: string;
	skillsCanTeach: Array<{
		subcategoryId: number;
		description: string;
		images: string[];
	}>;
	skillsWantToLearn: number[];
}
