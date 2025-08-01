// import styles from './TestPage.module.css';
import { CardUser } from '@/widgets/UserCard/CardUser';
import type { User } from '@/types';
import Input from '@/shared/ui/inputs/input/Input';
import { Button } from '@/shared/ui/button';
import AppleIcon from '@shared/assets/icons/clock.svg?react';

const tempUsers: User[] = [
	{
		id: 'f3f43f3f34f',
		name: 'Максим',
		location: 'Москва',
		gender: 'male',
		age: '23',
		description:
			'Привет! Люблю ритм, кофе по утрам и людей, которые не боятся пробовать новое',
		avatarUrl: '/assets/images/profile-pictures/Image3.svg',
		skillCanTeach: [
			{
				skill: 'Бизнес-план',
				categoryId: 0,
				subcategory: 0,
			},
			{
				skill: 'Английский язык',
				categoryId: 1,
				subcategory: 0,
			},
		],
		subcategoriesWantToLearn: [
			{
				skill: 'Бизнес-план',
				categoryId: 0,
				subcategory: 0,
			},
			{
				skill: 'Английский язык',
				categoryId: 1,
				subcategory: 0,
			},
			{
				skill: 'Тайм менеджмент',
				categoryId: 2,
				subcategory: 0,
			},
			{
				skill: 'Медитация',
				categoryId: 3,
				subcategory: 0,
			},
		],
	},
	{
		id: 'fsdf3f34f3f43',
		name: 'Виктория',
		location: 'Таджикистан',
		gender: 'female',
		age: '89',
		description:
			'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, delectus dolore cupiditate tenetur quasi suscipit reprehenderit rem aliquam vero perspiciatis ducimus doloremque fugit id eveniet nobis adipisci consequatur. Autem, qui?',
		avatarUrl: '/assets/images/profile-pictures/Image2.svg',
		skillCanTeach: [
			{
				skill: 'Бизнес-план',
				categoryId: 0,
				subcategory: 0,
			},
			{
				skill: 'Английский язык',
				categoryId: 1,
				subcategory: 0,
			},
		],
		subcategoriesWantToLearn: [
			{
				skill: 'Бизнес-план',
				categoryId: 0,
				subcategory: 0,
			},
			{
				skill: 'Английский язык',
				categoryId: 1,
				subcategory: 0,
			},
			{
				skill: 'Тайм менеджмент',
				categoryId: 2,
				subcategory: 0,
			},
			{
				skill: 'Медитация',
				categoryId: 3,
				subcategory: 0,
			},
		],
	},
	{
		id: 'sdf344f3f34f3f4',
		name: 'Рундиновивич',
		location: 'Длинная страна',
		gender: 'male',
		age: '33',
		description:
			'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, delectus dolore cupiditate tenetur quasi suscipit reprehenderit rem aliquam vero.',
		avatarUrl: '/assets/images/profile-pictures/Image4.svg',
		skillCanTeach: [],
		subcategoriesWantToLearn: [],
	},
	{
		id: 'dsf56sd56fd65fs',
		name: 'Максим',
		location: 'Москва',
		gender: 'male',
		age: '23',
		description:
			'Привет! Люблю ритм, кофе по утрам и людей, которые не боятся пробовать новое',
		avatarUrl: '/assets/images/profile-pictures/Image3.svg',
		skillCanTeach: [
			{
				skill: 'Бизнес-план',
				categoryId: 0,
				subcategory: 0,
			},
			{
				skill: 'Английский язык',
				categoryId: 1,
				subcategory: 0,
			},
		],
		subcategoriesWantToLearn: [
			{
				skill: 'Бизнес-план',
				categoryId: 0,
				subcategory: 0,
			},
			{
				skill: 'Английский язык',
				categoryId: 1,
				subcategory: 0,
			},
			{
				skill: 'Тайм менеджмент',
				categoryId: 2,
				subcategory: 0,
			},
			{
				skill: 'Медитация',
				categoryId: 3,
				subcategory: 0,
			},
			{
				skill: 'Английский язык',
				categoryId: 1,
				subcategory: 0,
			},
			{
				skill: 'Тайм менеджмент',
				categoryId: 2,
				subcategory: 0,
			},
			{
				skill: 'Медитация',
				categoryId: 3,
				subcategory: 0,
			},
		],
	},
	{
		id: 'dsf56sd56fd65fs',
		name: 'Максим',
		location: 'Москва',
		gender: 'male',
		age: '23',
		description:
			'Привет! Люблю ритм, кофе по утрам и людей, которые не боятся пробовать новое',
		avatarUrl: '/assets/images/profile-pictures/Image3.svg',
		skillCanTeach: [
			{
				skill: 'Бизнес-план',
				categoryId: 0,
				subcategory: 0,
			},
			{
				skill: 'Английский язык',
				categoryId: 1,
				subcategory: 0,
			},
		],
		subcategoriesWantToLearn: [
			{
				skill: 'Бизнес-план',
				categoryId: 0,
				subcategory: 0,
			},
			{
				skill: 'Английский язык',
				categoryId: 1,
				subcategory: 0,
			},
			{
				skill: 'Тайм менеджмент',
				categoryId: 2,
				subcategory: 0,
			},
			{
				skill: 'Медитация',
				categoryId: 3,
				subcategory: 0,
			},
			{
				skill: 'Английский язык',
				categoryId: 1,
				subcategory: 0,
			},
			{
				skill: 'Тайм менеджмент',
				categoryId: 2,
				subcategory: 0,
			},
			{
				skill: 'Медитация',
				categoryId: 3,
				subcategory: 0,
			},
		],
	},
];

export const TestPage = () => {
	return (
		<>
			<div>
				<p>Примеры FormInput</p>

				<form
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '8px',
						width: '50%',
					}}
				>
					<Input labelTitle='Имя' placeholder='Введите имя' />
					<Input
						labelTitle='Пароль'
						placeholder='Введите пароль'
						type='password'
					/>
					<Input
						labelTitle='Имя'
						placeholder='Введите имя'
						inputError={{
							errorType: 'error',
							message: 'Пароль должен содержать не менее 8 знаков',
						}}
					/>
					<Input
						showTooltipIcon={false}
						labelTitle='Имя'
						placeholder='Введите имя'
						inputError={{
							errorType: 'warning',
							message: 'Пароль должен содержать не менее 8 знаков',
						}}
					/>
					<Input
						tooltipIcon={<AppleIcon width={24} height={24} />}
						labelTitle='Имя'
						placeholder='Введите имя'
						inputError={{
							errorType: 'none',
							message: 'Пароль должен содержать не менее 8 знаков',
						}}
					/>
					<Button>Submit</Button>
				</form>
			</div>
			<h1>Страница для тестов</h1>
			<ul
				style={{
					display: 'grid',
					gridTemplateColumns: '1fr 1fr 1fr 1fr',
					gap: '24px',
				}}
			>
				{tempUsers?.map((item) => (
					<li key={item.id}>
						<CardUser displayMode='default' user={item} />
					</li>
				))}
			</ul>
		</>
	);
};
