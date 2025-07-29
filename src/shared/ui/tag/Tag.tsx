import clsx from 'clsx';
import type { ITagProps, SkillCategoriesType } from './Tag.props';
import styles from './Tag.module.css';
import { useLayoutEffect, useState } from 'react';

// Описание Компонента
// проп customBackgroundColor - для установки своего фонового цвета (тогда backgroundColorTemplate дожен быть не задан)
// проп backgroundColorTemplate - фон из уже опредленных значений категорий (HidedSkills - цвет спрятанных/группированных тегов)

const TagColors: Record<SkillCategoriesType, string> = {
	HidedSkills: '#E8ECF7',
	BusinessAndCareer: '#EEE7F7',
	CreativityAndArt: '#F7E7F2',
	ForeignLanguages: '#EBE5C5',
	EducationAndDevelopment: '#E7F2F6',
	HomeAndComfort: '#F7EBE5',
	HealthAndLifestyle: '#E9F7E7',
} as const;

// Универсальный компонент тега (Tag) для отображения категорий/меток
export const Tag = ({
	customBackgroundColor = '#FFF',
	children,
	backgroundColorTemplate,
	className,
	...props
}: ITagProps) => {
	const [backgroundColor, setBackgroundColor] = useState(customBackgroundColor);

	useLayoutEffect(() => {
		if (backgroundColorTemplate) {
			setBackgroundColor(() => {
				return TagColors[backgroundColorTemplate];
			});
		}
	}, []);

	return (
		<div
			className={clsx(className, styles.tag)}
			style={{
				backgroundColor,
			}}
			{...props}
		>
			{children}
		</div>
	);
};
