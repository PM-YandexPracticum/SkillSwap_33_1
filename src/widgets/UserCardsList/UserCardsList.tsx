import type { IUserCardsListProps } from './UserCardsList.props';
import { CardUser } from '../UserCard/UserCard';
import clsx from 'clsx';
import styles from './UserCardsList.module.css';
import { useDispatch } from '@/app/providers/store/StoreProvider';
import { asyncThunkSetLikeUserState } from '@/entities/slices/favoritesSlice';
import { getRuUserAgeСonjugation } from '@/shared/lib/user-formating-helpers';

// eslint-disable-next-line react/function-component-definition
export default function UserCardsList({
	users,
	className,
	children,
	...props
}: IUserCardsListProps) {
	const dispatch = useDispatch();

	return (
		<>
			<ul className={clsx(styles.wrapper, className)} {...props}>
				{users?.map((user) => {
					return (
						<li key={user.id}>
							<CardUser
								isExchangeSent={user.isExchangeSent}
								displayMode='default'
								user={{
									id: String(user.id),
									name: user.name,
									avatarUrl: user.avatarUrl,
									age: getRuUserAgeСonjugation(user.age),
									location: user.location,
									description: user.description,
									skillsCanTeach: user.skillsCanTeach.map((skill: any) => ({
										type: typeof skill === 'string' ? 0 : skill.categoryId,
										name:
											typeof skill === 'string' ? skill : skill.subcategoryName,
									})),
									skillsWantsToLearn: user.skillsWantToLearn.map(
										(skill: any) => ({
											type: typeof skill === 'string' ? 0 : skill.categoryId,
											name:
												typeof skill === 'string'
													? skill
													: skill.subcategoryName,
										})
									),
								}}
								onLikeButtonClicked={(liked) => {
									dispatch(
										asyncThunkSetLikeUserState({
											isLiked: liked,
											userId: user.id,
										})
									);
								}}
							/>
						</li>
					);
				})}
			</ul>
			{children}
		</>
	);
}
