import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchIcon from '../../shared/assets/icons/search.svg?react';
import ChevronDownIcon from '../../shared/assets/icons/chevron-down.svg?react';
import NotificationIcon from '../../shared/assets/icons/notification.svg?react';
import LikeIcon from '../../shared/assets/icons/like.svg?react';
import LogoutIcon from '../../shared/assets/icons/logout.svg?react'; // иконка выхода
import Logo from '../Logo/Logo';
import ThemeToggleButton from '@/app/styles/ThemeToggleButton';
import { DEFAULT_AVATAR } from '@/shared/hooks/useUser';
import './Header.css';

interface HeaderProps {
	variant?: 'guest' | 'user';
	userInfo?: {
		name: string;
		avatar: string;
	};
}

export const Header = ({ variant = 'guest', userInfo }: HeaderProps) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsDropdownOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleLogout = () => {
		// Очистка сессии
		navigate('/login');
	};

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
						<ThemeToggleButton className='theme-toggle' />
						<button className='action-button'>
							<NotificationIcon className='w-5 h-5' />
						</button>
						<button className='action-button'>
							<LikeIcon className='w-5 h-5' />
						</button>

						<div className='user-dropdown-wrapper' ref={dropdownRef}>
							<button
								className='user-info'
								onClick={() => setIsDropdownOpen((prev) => !prev)}
							>
								<span className='user-name'>{userInfo.name}</span>
								<div className='user-avatar'>
									<img
										src={userInfo.avatar || DEFAULT_AVATAR}
										alt='Профиль'
										onError={(event) => {
											const img = event.currentTarget;
											img.src = DEFAULT_AVATAR;
										}}
									/>
								</div>
							</button>

							{isDropdownOpen && (
								<div className='user-dropdown'>
									<Link to='/profile' className='dropdown-item'>
										Личный кабинет
									</Link>
									<button
										className='dropdown-item logout'
										onClick={handleLogout}
									>
										<span>Выйти из аккаунта</span>
										<LogoutIcon className='logout-icon' />
									</button>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</header>
	);
};

export default Header;
