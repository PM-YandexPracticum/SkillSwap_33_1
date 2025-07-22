import { Outlet } from 'react-router-dom';
import './ProfileLayout.css';
import { Header } from '@/components/Header/Header';
import ProfileSidebar from '@/pages/Profile/ProfileSidebar';
import Footer from '@/components/Footer/Footer';

const ProfileLayout = () => {
  return (
    <div className='profile-layout-container'>
      <Header variant='user' />
      
      <div className='profile-layout-content'>
        <ProfileSidebar />
        <Outlet />
      </div>

      <Footer />
    </div>
  );
};

export default ProfileLayout;