import { CardUser } from '@/widgets/UserCard/CardUser';
import type { User } from '@/types';
import Input from '@/shared/ui/inputs/input/Input';
import { Button } from '@/shared/ui/button';
import ButtonIcon from '@/shared/ui/ButtonIcon/ButtonIcon';
import AppleIcon from '@shared/assets/icons/clock.svg?react';
import HeartIcon from '@shared/assets/icons/heart-outline.svg?react';
import HeartFilledIcon from '@shared/assets/icons/heart-filled.svg?react';
import styles from './TestPage.module.css';
const tempUsers: User[] = [
	{
		id: '1',
		name: 'Максим',
		location: 'Москва',
		gender: 'male',
		age: '23',
		description: 'Привет! Люблю ритм, кофе по утрам и людей, которые не боятся пробовать новое',
		avatarUrl: '/assets/images/profile-pictures/Image3.svg',
		skillCanTeach: [
			{ skill: 'Бизнес-план', categoryId: 0, subcategory: 0 },
			{ skill: 'Английский язык', categoryId: 1, subcategory: 0 },
		],
		subcategoriesWantToLearn: [
			{ skill: 'Тайм менеджмент', categoryId: 2, subcategory: 0 },
			{ skill: 'Медитация', categoryId: 3, subcategory: 0 },
		],
	},
	{
		id: '2',
		name: 'Виктория',
		location: 'Таджикистан',
		gender: 'female',
		age: '28',
		description: 'Люблю путешествовать и изучать новые языки.',
		avatarUrl: '/assets/images/profile-pictures/Image2.svg',
		skillCanTeach: [
			{ skill: 'Французский язык', categoryId: 1, subcategory: 0 },
		],
		subcategoriesWantToLearn: [
			{ skill: 'Кулинария', categoryId: 4, subcategory: 0 },
		],
	},
];
export const TestPage = () => {
	return (
		<>
			<div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
				<section>
					<p>Примеры FormInput</p>
					<form
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: '8px',
							width: '50%',
						}}
					>
						<Input labelTitle="Имя" placeholder="Введите имя" />
						<Input
							labelTitle="Пароль"
							placeholder="Введите пароль"
							type="password"
						/>
						<Input
							labelTitle="Имя"
							placeholder="Введите имя"
							inputError={{
								errorType: 'error',
								message: 'Пароль должен содержать не менее 8 знаков',
							}}
						/>
						<Input
							showTooltipIcon={false}
							labelTitle="Имя"
							placeholder="Введите имя"
							inputError={{
								errorType: 'warning',
								message: 'Пароль должен содержать не менее 8 знаков',
							}}
						/>
						<Input
							tooltipIcon={<AppleIcon width={24} height={24} />}
							labelTitle="Имя"
							placeholder="Введите имя"
							inputError={{
								errorType: 'none',
								message: 'Пароль должен содержать не менее 8 знаков',
							}}
						/>
						<Button>Submit</Button>
					</form>
				</section>
				<section>
					<p>Пример ButtonIcon</p>
					<ButtonIcon
						className={styles.iconButton}
						aria-label={true ? 'Убрать лайк' : 'Поставить лайк'}
						onClick={() => {
							console.log('clicked');
						}}
					>
						{false ? <HeartFilledIcon /> : <HeartIcon />}
					</ButtonIcon>
				</section>
			</div>
			<h1>Страница для тестов</h1>
			<ul
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
					gap: '24px',
				}}
			>
				{tempUsers.map((user) => (
					<li key={user.id}>
						<CardUser displayMode="default" user={user} />
					</li>
				))}
			</ul>
		</>
	);
};