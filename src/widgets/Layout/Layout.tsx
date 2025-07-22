import { Outlet, useLocation } from 'react-router-dom';
import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import ProfileSidebar from '@/pages/Profile/ProfileSidebar';

const Layout = () => {
	const location = useLocation();

	// Проверяем, находится ли пользователь в профиле или в его подразделах
	const isProfile = location.pathname.startsWith('/profile');

	const userInfo = {
		name: 'Мария',
		avatar:
			'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
	};

	return (
		<>
			<Header
				variant={isProfile ? 'user' : 'guest'}
				userInfo={isProfile ? userInfo : undefined}
			/>
			<main style={{ display: 'flex' }}>
				{isProfile && <ProfileSidebar />}
				<div style={{ flexGrow: 1 }}>
					<Outlet />
				</div>
			</main>
			<Footer />
		</>
	);
};

export default Layout;
