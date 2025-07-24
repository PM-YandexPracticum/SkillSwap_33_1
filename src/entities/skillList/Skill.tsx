import type { SkillListProps } from './Skill.module';

export const SkillList = ({
	skills,
	maxVisible = 2,
	className,
}: SkillListProps) => {
	const visibleSkills = skills.slice(0, maxVisible);
	const hiddenCount = skills.length - maxVisible;

	return (
		<>
			{visibleSkills.map((skill) => (
				<li key={skill} className={className}>
					{skill}
				</li>
			))}
			{hiddenCount > 0 && <li className={className}>+{hiddenCount}</li>}
		</>
	);
};
