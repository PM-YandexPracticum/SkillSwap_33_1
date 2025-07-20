import { Outlet } from 'react-router-dom';
import './ProfileLayout.css';
import { Header } from '@/components/Header/Header';
import ProfileSidebar from '@/pages/Profile/ProfileSidebar';
import Footer from '@/components/Footer/Footer';

const ProfileLayout = () => {
	const userInfo = {
		name: 'Мария',
		avatar:
			'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
	};

	return (
		<div className='profile-layout-container'>
			<Header variant='user' userInfo={userInfo} />

			<div className='profile-layout-content'>
				<ProfileSidebar />
				<Outlet />
			</div>

			<Footer />
		</div>
	);
};

export default ProfileLayout;
