import clsx from 'clsx';
import type { ITagProps, SkillCategoriesType } from './Tag.props';
import styles from './Tag.module.css';
import { useLayoutEffect, useState } from 'react';

// Описание Компонента
// проп customBackgroundColor - для установки своего фонового цвета (тогда backgroundColorTemplate должен быть не задан)
// проп backgroundColorTemplate - фон из уже определённых значений категорий (HidedSkills - цвет спрятанных/группированных тегов)

const TagColors: Record<SkillCategoriesType, string> = {
	HidedSkills: 'var(--color-tag-more)',
	BusinessAndCareer: 'var(--color-tag-business)',
	CreativityAndArt: 'var(--color-tag-art)',
	ForeignLanguages: 'var(--color-tag-languages)',
	EducationAndDevelopment: 'var(--color-tag-education)',
	HomeAndComfort: 'var(--color-tag-home)',
	HealthAndLifestyle: 'var(--color-tag-lifestyle)',
} as const;

// Универсальный компонент тега (Tag) для отображения категорий/меток
export const Tag = ({
	customBackgroundColor = '#FFF',
	children,
	backgroundColorTemplate,
	onMoreButtonClick,
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
	}, [backgroundColorTemplate]);

	if (onMoreButtonClick) {
		return (
			<button
				className={clsx(className, styles.tag, styles.tagButton)}
				style={{
					backgroundColor,
				}}
				onClick={onMoreButtonClick}
				aria-label='Раскрыть список навыков'
			>
				{children}
			</button>
		);
	} else {
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
	}
};
