import { NavLink } from 'react-router-dom';
import './ProfileSidebar.css';
import RequestIcon from '../../shared/assets/icons/request.svg?react';
import MessageTextIcon from '../../shared/assets/icons/message-text.svg?react';
import LikeIcon from '../../shared/assets/icons/like.svg?react';
import IdeaIcon from '../../shared/assets/icons/hugeicons_idea-01.svg?react';
import UserIcon from '../../shared/assets/icons/user.svg?react';

const ProfileSidebar = () => {
	const menuItems = [
		{
			id: 'applications',
			label: 'Заявки',
			icon: RequestIcon,
			path: '/profile/applications',
		},
		{
			id: 'exchanges',
			label: 'Мои обмены',
			icon: MessageTextIcon,
			path: '/profile/exchanges',
		},
		{
			id: 'favorites',
			label: 'Избранное',
			icon: LikeIcon,
			path: '/profile/favorites',
		},
		{
			id: 'skills',
			label: 'Мои навыки',
			icon: IdeaIcon,
			path: '/profile/skills',
		},
		{
			id: 'personal',
			label: 'Личные данные',
			icon: UserIcon,
			path: '/profile',
		},
	];

	return (
		<div className='profile-sidebar'>
			<nav className='sidebar-nav'>
				{menuItems.map((item) => {
					const Icon = item.icon;
					return (
						<NavLink
							key={item.id}
							to={item.path}
							end={item.path === '/profile'}
							className={({ isActive }) =>
								`sidebar-nav-item ${isActive ? 'active' : ''}`
							}
						>
							<Icon className='sidebar-nav-icon' />
							<span>{item.label}</span>
						</NavLink>
					);
				})}
			</nav>
		</div>
	);
};

export default ProfileSidebar;
