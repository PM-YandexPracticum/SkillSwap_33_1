import { Tag } from '@/shared/ui/tag/Tag';
import styles from './UserCardTagsList.module.css';
import type { SkillCategoriesType } from '@/shared/ui/tag/Tag.props';
import type { IUserCardTagsListProps } from './UserCardTagsList.props';
import { useState } from 'react';

// для настройки и корректного отображения цветов Tags поменять очередность категорий (индекс 0 => BusinessAndCareer, ...,  индекс 6 => HidedSkills)
export const UserCardSkillsColors: Array<SkillCategoriesType> = [
	'HidedSkills', // UserSkill->categoryId === 0
	'BusinessAndCareer', // UserSkill->categoryId === 1
	'CreativityAndArt', // UserSkill->categoryId === 2
	'ForeignLanguages', // UserSkill->categoryId === 3
	'EducationAndDevelopment', // UserSkill->categoryId === 4
	'HomeAndComfort', // UserSkill->categoryId === 5
	'HealthAndLifestyle', // UserSkill->categoryId === 6
] as const;

// eslint-disable-next-line react/function-component-definition
export default function UserCardTagsList({
	headingTitle,
	tags,
	maxTagsShown = 2,
}: IUserCardTagsListProps) {
	const [allTagsShown, setAllTagsShown] = useState(false);

	function getTags() {
		if (tags.length > maxTagsShown && !allTagsShown) {
			const tagsSelected = tags.slice(0, maxTagsShown);

			tagsSelected.push({
				name: String(`+${tags.length - maxTagsShown}`),
				type: 0,
			});
			return tagsSelected;
		} else {
			return tags;
		}
	}

	return (
		<div className={styles.tagsWrapper}>
			{headingTitle && <h3 className={styles.tagTitle}>{headingTitle}</h3>}

			<ul className={styles.tagsList}>
				{getTags().map((tag) => {
					if (tag.type === 0) {
						return (
							<li key={tag.name} className={styles.tagItem}>
								<Tag
									onMoreButtonClick={() => setAllTagsShown(true)}
									backgroundColorTemplate={UserCardSkillsColors[tag.type]}
								>
									{tag.name}
								</Tag>
							</li>
						);
					} else {
						return (
							<li key={tag.name} className={styles.tagItem}>
								<Tag backgroundColorTemplate={UserCardSkillsColors[tag.type]}>
									{tag.name}
								</Tag>
							</li>
						);
					}
				})}
			</ul>
		</div>
	);
}
