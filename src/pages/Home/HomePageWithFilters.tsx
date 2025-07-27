import React from 'react';
import { Layout } from '@/widgets/Layout/Layout';
import { FiltersBar } from '@/widgets/FiltersBar/FiltersBar';
import { HomePage } from './HomePage';

/**
 * Главная страница с фильтрами
 * Объединяет Layout, фильтры и контент главной страницы
 */
export const HomePageWithFilters: React.FC = () => {
	return (
		<Layout showFilters={true} filtersComponent={<FiltersBar />}>
			<HomePage />
		</Layout>
	);
};
