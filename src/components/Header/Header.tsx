import LikeIcon from '../../shared/assets/icons/like.svg?react';
import NotificationIcon from '../../shared/assets/icons/Notification.svg?react';
import ChevronDownIcon from '../../shared/assets/icons/chevron-down.svg?react';
import SearchIcon from '../../shared/assets/icons/search.svg?react';
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
					<a href='/' className='logo-link'>
						<Logo />
					</a>
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
						<button className='auth-button auth-button__login'>Войти</button>
						<button className='auth-button auth-button__register'>
							Зарегистрироваться
						</button>
					</div>
				)}

				{variant === 'user' && (
					<div className='user-actions'>
						<ThemeToggleButton className='action-button' />
						<button className='action-button'>
							<NotificationIcon className='w-5 h-5' />
						</button>
						<button className='action-button'>
							<LikeIcon className='w-5 h-5' />
						</button>

						<div className='user-info'>
							<span className='user-name'>
								{userInfo?.name || 'Пользователь'}
							</span>
							<div className='user-avatar'>
								<img
									src={
										userInfo?.avatar ||
										'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'
									}
									alt='Profile'
								/>
							</div>
						</div>
					</div>
				)}
			</div>
		</header>
	);
};

export default Header;
