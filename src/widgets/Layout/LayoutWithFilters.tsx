import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from './Layout';
import { FiltersBar } from '@/components/FiltersBar/FiltersBar';

/**
 * Layout с фильтрами для главной страницы
 * Обертка над основным Layout с добавлением фильтров
 */
export const LayoutWithFilters: React.FC = () => {
	return (
		<Layout showFilters={true} filtersComponent={<FiltersBar />}>
			<Outlet />
		</Layout>
	);
};
