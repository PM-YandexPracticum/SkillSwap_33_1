// Сетка карточек навыков (Grid/List)
import style from './skillGrid.module.css';
import type { User } from '../../types';
import { SkillCard } from '../SkillCard/SkillCard';

type Props = {
	items: User[];
	showMoreButton?: boolean;
	showDescription?: boolean;
};

export const GridView = ({ items, showMoreButton, showDescription }: Props) => (
	<div className={style.grid}>
		{items.map((user) => (
			<SkillCard
				key={user.id}
				user={user}
				showMoreButton={showMoreButton}
				showDescription={showDescription}
			/>
		))}
	</div>
);
