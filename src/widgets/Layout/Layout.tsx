import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import styles from './Layout.module.css';

/**
 * Пропсы для компонента Layout
 */
interface LayoutProps {
	/** Дочерние компоненты */
	children?: React.ReactNode;
	/** Показывать ли блок фильтров */
	showFilters?: boolean;
	/** Компонент фильтров */
	filtersComponent?: React.ReactNode;
}

/**
 * Основной макет приложения
 * Включает header, основной контент с возможностью фильтров и footer
 */
export const Layout: React.FC<LayoutProps> = ({
	children,
	showFilters = false,
	filtersComponent,
}) => {
	return (
		<div className={styles.layout}>
			{/* Заголовок */}
			<Header />

			{/* Основной контент */}
			<main className={styles.main}>
				{/* Контейнер с фильтрами и контентом */}
				<div className={styles.contentContainer}>
					{/* Блок фильтров */}
					{showFilters && filtersComponent && (
						<aside className={styles.filtersSidebar}>{filtersComponent}</aside>
					)}

					{/* Основной контент */}
					<div className={styles.content}>{children || <Outlet />}</div>
				</div>
			</main>

			{/* Подвал */}
			<Footer />
		</div>
	);
};
