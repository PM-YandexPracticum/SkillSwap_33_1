import { Outlet, useLocation } from 'react-router-dom';
import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import ProfileSidebar from '@/pages/Profile/ProfileSidebar';
import { useUser } from '../../shared/hooks/useUser';

const Layout = () => {
	const location = useLocation();
	const { name, avatarUrl } = useUser();

	const isProfile = location.pathname.startsWith('/profile');

	return (
		<>
			<Header
				variant={isProfile ? 'user' : 'guest'}
				userInfo={isProfile ? { name, avatar: avatarUrl } : undefined}
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
