import type { DetailedHTMLProps, HTMLAttributes } from 'react';

type TagPropsType = DetailedHTMLProps<
	HTMLAttributes<HTMLDivElement>,
	HTMLDivElement
>;

// TODO: SkillCategoriesType Вынести в общие типы (основной файл типов ts)
export type SkillCategoriesType =
	| 'BusinessAndCareer'
	| 'CreativityAndArt'
	| 'ForeignLanguages'
	| 'EducationAndDevelopment'
	| 'HomeAndComfort'
	| 'HealthAndLifestyle'
	| 'HidedSkills';

export interface ITagProps extends TagPropsType {
	customBackgroundColor?: string;
	children: React.ReactNode;
	backgroundColorTemplate?: SkillCategoriesType;
	onMoreButtonClick?: () => void;
}
