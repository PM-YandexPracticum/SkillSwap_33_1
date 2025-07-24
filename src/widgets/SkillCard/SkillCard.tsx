import style from './SkillCard.module.css';
import type { User } from '../../types/index';
import { SkillList } from '../../entities/skillList/Skill';
import { ToggleFavoriteButton } from '../../features/favorites/FavoriteButton';
import {
	getSkillsCanTeach,
	getSkillsWantToLearn,
} from '../../entities/user/User.selector';

export type SkillCardProps = {
	user: User;
	showMoreButton?: boolean;
	showDescription?: boolean;
};

export const SkillCard = ({
	user,
	showMoreButton,
	showDescription,
}: SkillCardProps) => {
	const canTeach = getSkillsCanTeach(user);
	const wantToLearn = getSkillsWantToLearn(user);

	return (
		<div className={style.card}>
			<div className={style.header}>
				<div className={style.profile}>
					{user.avatarUrl && (
						<img
							src={user.avatarUrl}
							className={style.avatar}
							alt={user.name}
						/>
					)}
					<div className={style.info}>
						<h3 className={style.name}>{user.name}</h3>
						<p className={style.city}>
							{user.location}, {user.age} года
						</p>
					</div>
				</div>
				<ToggleFavoriteButton />
			</div>

			{showDescription && user.description && (
				<p className={style.description}>{user.description}</p>
			)}

			<div className={style.skillSection}>
				<h4 className={style.skillTitle}>Может научить:</h4>
				<ul className={style.skillList}>
					<SkillList skills={canTeach} className={style.skillItem} />
				</ul>
			</div>

			<div className={style.skillSection}>
				<h4 className={style.skillTitle}>Хочет научиться:</h4>
				<ul className={style.skillList}>
					<SkillList skills={wantToLearn} className={style.skillItem} />
				</ul>
			</div>

			{showMoreButton && (
				<button className={style.detailsButton}>Подробнее</button>
			)}
		</div>
	);
};
