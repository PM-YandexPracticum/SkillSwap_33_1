import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '@/components/Header/Header';
import { useUser } from '@/shared/hooks/useUser';
import styles from './Layout.module.css';
import ProfileSidebar from '@/pages/Profile/ProfileSidebar';
import Footer from '@/components/Footer/Footer';

interface LayoutProps {
	children?: React.ReactNode;
	showFilters?: boolean;
	filtersComponent?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
	children,
	showFilters = false,
	filtersComponent,
}) => {
	const location = useLocation();
	const { name, avatarUrl } = useUser();
	const isProfilePage = location.pathname.startsWith('/profile');
	const isAuthenticated =
		typeof window !== 'undefined' &&
		Boolean(window.localStorage.getItem('currentUser'));

	return (
		<div className={styles.layout}>
			<Header
				variant={isAuthenticated ? 'user' : 'guest'}
				userInfo={
					isAuthenticated ? { name: name || '', avatar: avatarUrl } : undefined
				}
			/>

			<main className={styles.main}>
				<div className={styles.contentContainer}>
					{/* Profile sidebar */}
					{isProfilePage && <ProfileSidebar />}

					{/* Filters sidebar */}
					{showFilters && filtersComponent && (
						<aside className={styles.filtersSidebar}>{filtersComponent}</aside>
					)}

					{/* Main content */}
					<div className={styles.content}>{children || <Outlet />}</div>
				</div>
			</main>

			<Footer />
		</div>
	);
};
