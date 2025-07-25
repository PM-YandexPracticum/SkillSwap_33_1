import { Link } from 'react-router-dom';
import SearchIcon from '../../shared/assets/icons/search.svg?react';
import ChevronDownIcon from '../../shared/assets/icons/chevron-down.svg?react';
import NotificationIcon from '../../shared/assets/icons/notification.svg?react';
import LikeIcon from '../../shared/assets/icons/like.svg?react';
import './Header.css';
import Logo from '../Logo/Logo';
import ThemeToggleButton from '@/app/styles/ThemeToggleButton';

interface HeaderProps {
	variant?: 'guest' | 'user';
	userInfo?: {
		name: string;
		avatar: string;
	};
}

export const Header = ({ variant = 'guest', userInfo }: HeaderProps) => {
	return (
		<header className='header'>
			<div className='header-container'>
				<div className='header-left'>
					<Link to='/' className='logo-link'>
						<Logo />
					</Link>
					<nav className='nav-container'>
						<a href='#' className='nav-link'>
							О проекте
						</a>
						<div className='nav-dropdown'>
							<span>Все навыки</span>
							<ChevronDownIcon className='w-4 h-4' />
						</div>
					</nav>
				</div>

				<div className='search-container'>
					<div className='search-wrapper'>
						<SearchIcon className='search-icon' />
						<input
							type='text'
							placeholder='Искать навык'
							className='search-input'
						/>
					</div>
				</div>

				{variant === 'guest' && (
					<div className='auth-actions'>
						<ThemeToggleButton className='theme-toggle' />
						<Link to='/login' className='auth-button auth-button__login'>
							Войти
						</Link>
						<Link to='/register' className='auth-button auth-button__register'>
							Зарегистрироваться
						</Link>
					</div>
				)}

				{variant === 'user' && userInfo && (
					<div className='user-actions'>
						<ThemeToggleButton className='action-button' />
						<button className='action-button'>
							<NotificationIcon className='w-5 h-5' />
						</button>
						<button className='action-button'>
							<LikeIcon className='w-5 h-5' />
						</button>

						<div className='user-info'>
							<span className='user-name'>{userInfo.name}</span>
							<div className='user-avatar'>
								<img src={userInfo.avatar} alt='Profile' />
							</div>
						</div>
					</div>
				)}
			</div>
		</header>
	);
};

export default Header;
