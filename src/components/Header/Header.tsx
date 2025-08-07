import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchIcon from '../../shared/assets/icons/search.svg?react';
import ChevronDownIcon from '../../shared/assets/icons/chevron-down.svg?react';
import NotificationIcon from '../../shared/assets/icons/notification.svg?react';
import NotificationWithDotIcon from '../../shared/assets/icons/bell-with-dot.svg?react';
import LikeIcon from '../../shared/assets/icons/like.svg?react';
import LikeFilledIcon from '../../shared/assets/icons/like-filled.svg?react';
import LogoutIcon from '../../shared/assets/icons/logout.svg?react';
import IdeaIcon from '../../shared/assets/icons/hugeicons_idea-01.svg?react';
import Logo from '../Logo/Logo';
import ThemeToggleButton from '@/app/styles/ThemeToggleButton';
import { DEFAULT_AVATAR } from '@/shared/hooks/useUser';
import { useAuth } from '@/features/auth/AuthForm.model';
import { useAppDispatch, useAppSelector } from '@/app/providers/store/hooks';
import { setSearchFilter } from '@/entities/slices/filtersSlice';
import { toggleFavoritesOnly } from '@/entities/slices/filtersSlice';
import { getUserRequests, updateRequestStatus } from '@/api/requests.api';
import { getCurrentUser } from '@/features/auth/AuthForm.model';
import type { ExchangeRequest } from '@/api/requests.api';
import './Header.css';

interface HeaderProps {
	variant?: 'guest' | 'user';
	userInfo?: {
		name: string;
		avatar: string;
	};
}

function getUserNameById(userId: string): string {
	const authUsers = JSON.parse(localStorage.getItem('auth_users') || '[]');
	const tempCards = JSON.parse(localStorage.getItem('temp_user_cards') || '[]');
	const user = authUsers.find((u: any) => `usr_${u.id}` === userId);
	if (user) return user.fullName || 'Пользователь';
	const card = tempCards.find((c: any) => c.id === userId);
	return card?.fullName || 'Пользователь';
}

function formatDate(dateStr?: string): string {
	if (!dateStr) return 'Дата неизвестна';
	const date = new Date(dateStr);
	if (isNaN(date.getTime())) return 'Дата некорректна';

	const now = new Date();
	if (
		date.getDate() === now.getDate() &&
		date.getMonth() === now.getMonth() &&
		date.getFullYear() === now.getFullYear()
	) {
		return 'сегодня';
	}

	const yesterday = new Date(now);
	yesterday.setDate(now.getDate() - 1);
	if (
		date.getDate() === yesterday.getDate() &&
		date.getMonth() === yesterday.getMonth() &&
		date.getFullYear() === yesterday.getFullYear()
	) {
		return 'вчера';
	}

	const monthNames = [
		'янв',
		'фев',
		'мар',
		'апр',
		'май',
		'июн',
		'июл',
		'авг',
		'сен',
		'окт',
		'ноя',
		'дек',
	];
	return `${date.getDate()} ${monthNames[date.getMonth()]}`;
}

export const Header = ({ variant = 'guest', userInfo }: HeaderProps) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isNotificationOpen, setIsNotificationOpen] = useState(false);

	type NotificationType = {
		id: string;
		text: string;
		isUnread: boolean;
		fromUserId: string;
		toUserId: string;
		status: ExchangeRequest['status'];
		createdAt: string;
	};

	const [notifications, setNotifications] = useState<NotificationType[]>([]);
	const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

	const dropdownRef = useRef<HTMLDivElement>(null);
	const notifRef = useRef<HTMLDivElement>(null);

	const navigate = useNavigate();
	const { logout } = useAuth();
	const dispatch = useAppDispatch();
	const search = useAppSelector((state) => state.filters.search);
	const favoritesOnly = useAppSelector((state) => state.filters.favoritesOnly);

	const loadNotifications = useCallback(() => {
		const currentUser = getCurrentUser();
		if (!currentUser?.id) return;

		const myId = `usr_${currentUser.id}`;
		const allRequests: ExchangeRequest[] = getUserRequests();

		setNotifications((prevNotifications) => {
			const prevById = new Map(prevNotifications.map((n) => [n.id, n]));
			const updatedNotifs: NotificationType[] = [];

			allRequests.forEach((req) => {
				const otherUserId =
					req.fromUserId === myId ? req.toUserId : req.fromUserId;
				const otherUserName = getUserNameById(otherUserId);
				const createdAt = req.createdAt || new Date().toISOString();

				if (req.status === 'pending' && req.toUserId === myId) {
					updatedNotifs.push({
						id: req.id,
						text: `${otherUserName} предлагает вам обмен`,
						isUnread: prevById.get(req.id)?.isUnread ?? true,
						fromUserId: req.fromUserId,
						toUserId: req.toUserId,
						status: req.status,
						createdAt,
					});
					return;
				}

				if (
					['inProgress', 'rejected', 'done'].includes(req.status) &&
					(req.fromUserId === myId || req.toUserId === myId)
				) {
					let text = '';
					if (req.status === 'inProgress' && req.fromUserId === myId) {
						text = `${otherUserName} принял ваш обмен`;
					} else if (req.status === 'rejected' && req.fromUserId === myId) {
						text = `${otherUserName} отклонил ваш обмен`;
					} else if (req.status === 'done') {
						text = `Обмен с ${otherUserName} завершён`;
					} else {
						return;
					}

					updatedNotifs.push({
						id: req.id,
						text,
						isUnread: prevById.get(req.id)?.isUnread ?? true,
						fromUserId: req.fromUserId,
						toUserId: req.toUserId,
						status: req.status,
						createdAt,
					});
				}
			});

			setHasUnreadNotifications(updatedNotifs.some((n) => n.isUnread));
			return updatedNotifs;
		});
	}, []);

	useEffect(() => {
		loadNotifications();
	}, [loadNotifications]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsDropdownOpen(false);
			}
			if (
				notifRef.current &&
				!notifRef.current.contains(event.target as Node)
			) {
				setIsNotificationOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	const markAllAsRead = () => {
		const currentUser = getCurrentUser();
		if (!currentUser?.id) return;

		notifications.forEach((n) => {
			if (n.isUnread) {
				updateRequestStatus(n.fromUserId, n.toUserId, 'inProgress');
			}
		});

		setHasUnreadNotifications(false);
		setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
	};

	const clearReadNotifications = () => {
		setNotifications((prev) => prev.filter((n) => n.isUnread));
	};

	const newNotifications = notifications.filter((n) => n.isUnread);
	const readNotifications = notifications.filter((n) => !n.isUnread);

	const goToProfile = (n: NotificationType) => {
		setNotifications((prev) => {
			const updated = prev.map((notif) =>
				notif.id === n.id ? { ...notif, isUnread: false } : notif
			);
			setHasUnreadNotifications(updated.some((notif) => notif.isUnread));
			return updated;
		});

		const currentUser = getCurrentUser();
		const myId = currentUser ? `usr_${currentUser.id}` : '';

		if (n.status === 'pending' && n.toUserId === myId) {
			navigate('/profile/exchanges');
		} else if (n.status === 'done' && n.fromUserId === myId) {
			navigate('/profile/exchanges');
		} else if (n.fromUserId === myId) {
			navigate('/profile/applications');
		} else {
			navigate('/profile/exchanges');
		}

		setIsNotificationOpen(false);
	};

	const getSubText = (n: NotificationType) => {
		if (n.status === 'pending') {
			return 'Примите обмен, чтобы обсудить детали';
		}
		if (n.status === 'inProgress' || n.status === 'done') {
			return 'Перейдите в профиль, чтобы обсудить детали';
		}
		if (n.status === 'rejected') {
			return 'Обмен отклонён';
		}
		return '';
	};

	return (
		<header className='header'>
			<div className='header-container'>
				{/* Левая часть */}
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

				{/* Поиск */}
				<div className='search-container'>
					<div className='search-wrapper'>
						<SearchIcon className='search-icon' />
						<input
							type='text'
							placeholder='Искать навык'
							className='search-input'
							value={search}
							onChange={(e) => dispatch(setSearchFilter(e.target.value))}
						/>
					</div>
				</div>

				{/* Гость */}
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

				{/* Авторизованный */}
				{variant === 'user' && userInfo && (
					<div className='user-actions'>
						<ThemeToggleButton className='theme-toggle' />

						{/* Уведомления */}
						<div className='notif-wrapper' ref={notifRef}>
							<button
								className='action-button notification-btn'
								onClick={() => setIsNotificationOpen((prev) => !prev)}
								aria-label='Открыть уведомления'
							>
								{hasUnreadNotifications ? (
									<NotificationWithDotIcon className='w-5 h-5' />
								) : (
									<NotificationIcon className='w-5 h-5' />
								)}
							</button>

							{isNotificationOpen && (
								<div className='notifications-dropdown'>
									{newNotifications.length > 0 && (
										<div className='notif-section'>
											<span className='notif-header'>Новые уведомления</span>
											<button className='notif-action' onClick={markAllAsRead}>
												Прочитать все
											</button>
										</div>
									)}

									{readNotifications.length > 0 && (
										<div className='notif-section'>
											<span className='notif-header'>Просмотренные</span>
											<button
												className='notif-action'
												onClick={clearReadNotifications}
											>
												Очистить
											</button>
										</div>
									)}

									<ul className='notif-list'>
										{notifications.length > 0 ? (
											notifications.map((n) => (
												<li
													key={n.id}
													className={
														n.isUnread ? 'notif-item unread' : 'notif-item'
													}
												>
													<div className='notif-top-row'>
														<IdeaIcon className='notif-icon' />
														<div className='notif-text-wrapper'>
															<div className='notif-main-text'>{n.text}</div>
															<div className='notif-sub-text'>
																{getSubText(n)}
															</div>
														</div>
														<div className='notif-date'>
															{formatDate(n.createdAt)}
														</div>
													</div>
													{n.isUnread && (
														<button
															className='notif-go-btn'
															onClick={() => goToProfile(n)}
															type='button'
														>
															Перейти
														</button>
													)}
												</li>
											))
										) : (
											<li className='notif-empty'>Нет новых уведомлений</li>
										)}
									</ul>
								</div>
							)}
						</div>

						{/* Лайки */}
						<button
							className='action-button'
							onClick={() => dispatch(toggleFavoritesOnly())}
							aria-label='Фильтровать избранное'
						>
							{favoritesOnly ? (
								<LikeFilledIcon className='w-5 h-5' />
							) : (
								<LikeIcon className='w-5 h-5' />
							)}
						</button>

						{/* Профиль */}
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
										onError={(e) => {
											const target = e.currentTarget;
											target.src = DEFAULT_AVATAR;
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
