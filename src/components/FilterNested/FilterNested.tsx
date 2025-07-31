import { useState } from 'react';
import type { SkillCategory } from '../../types';
import FilterNestedUI from '../../shared/ui/FilterNested/FilterNested';

type Props = {
	title?: string;
	items: SkillCategory[];
	buttonName: string;
	checkedItems: number[];
	toggleSkillCheck: (skillId: number) => void;
	onMarkCategory: (categoryId: number) => void;
	onUnmarkCategory: (categoryId: number) => void;
};

const FilterNested = ({
	title,
	items,
	buttonName,
	checkedItems,
	toggleSkillCheck,
	onMarkCategory,
	onUnmarkCategory,
}: Props) => {
	const [expandedCategories, setExpandedCategories] = useState<number[]>([]);

	const [showAll, setShowAll] = useState(false);

	const toggleShowAll = () => {
		setShowAll((prev) => !prev);
	};
	const toggleCategoryExpand = (categoryId: number) => {
		setExpandedCategories((prev) =>
			prev.includes(categoryId)
				? prev.filter((id) => id !== categoryId)
				: [...prev, categoryId]
		);
	};

	return (
		<FilterNestedUI
			title={title}
			items={items}
			checkedItems={checkedItems}
			expandedCategories={expandedCategories}
			showAll={showAll}
			toggleShowAll={toggleShowAll}
			toggleCategoryExpand={toggleCategoryExpand}
			toggleSkillCheck={toggleSkillCheck}
			buttonName={buttonName}
			onMarkCategory={onMarkCategory}
			onUnmarkCategory={onUnmarkCategory}
		/>
	);
};

export default FilterNested;
