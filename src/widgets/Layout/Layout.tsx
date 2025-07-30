import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import styles from './Layout.module.css';

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
	const isProfilePage = location.pathname.startsWith('/profile');

	const mockUser = {
		name: 'Алиса',
		avatar: '/assets/images/profile-pictures/avatar-default.svg',
	};

	return (
		<div className={styles.layout}>
			<Header
				variant={isProfilePage ? 'user' : 'guest'}
				userInfo={isProfilePage ? mockUser : undefined}
			/>

			<main className={styles.main}>
				<div className={styles.contentContainer}>
					{showFilters && filtersComponent && (
						<aside className={styles.filtersSidebar}>{filtersComponent}</aside>
					)}
					<div className={styles.content}>{children || <Outlet />}</div>
				</div>
			</main>

			<Footer />
		</div>
	);
};
