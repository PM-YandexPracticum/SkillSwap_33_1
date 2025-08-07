import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useDispatch } from '@/app/providers/store/StoreProvider';
import { asyncThunkGetUsersAddedIntoFavorites } from '@/entities/slices/favoritesSlice';
import { getCurrentUser } from '@/features/auth/AuthForm.model';

const HomePage = lazy(() => import('@/pages/Home/HomePage'));
const NotFound404 = lazy(() => import('@/pages/NotFound404/NotFound404'));
const FavoritesPage = lazy(() => import('@/pages/Favorites/FavoritesPage'));
const Error500 = lazy(() => import('@/pages/Error500/Error500'));
const ProfilePage = lazy(() => import('@/pages/Profile/ProfilePage'));
const MySkillsPage = lazy(() => import('@/pages/Profile/MySkillsPage'));
const ExchangesPage = lazy(() => import('@/pages/Profile/ExchangesPage'));
const ApplicationsPage = lazy(() => import('@/pages/Profile/ApplicationsPage'));
const RegisterLayout = lazy(() => import('@/pages/Register/RegisterLayout'));
const RegisterStep1 = lazy(() => import('@/pages/Register/RegisterStep1'));
const RegisterStep2 = lazy(() => import('@/pages/Register/RegisterStep2'));
const RegisterStep3 = lazy(() => import('@/pages/Register/RegisterStep3'));
const RegisterProvider = lazy(() =>
        import('@/pages/Register/RegisterContext').then((m) => ({
                default: m.RegisterProvider,
        }))
);
const LoginPage = lazy(() => import('@/pages/Login/LoginPage'));
const SkillPage = lazy(() => import('@/pages/Skill/SkillPage'));
const TestPage = lazy(() => import('@/pages/TestPage/TestPage'));
import '@appStyles/fonts.css';
import '@appStyles/normalize.css';
import '@appStyles/global.css';
import '@appStyles/theme.css';

import { Layout } from '@/widgets/Layout/Layout';
import { LayoutWithFilters } from '@/widgets/Layout/LayoutWithFilters';
import { ThemeProvider } from '@app/styles/ThemeProvider';
import PrivateRoute from '@/features/auth/PrivateRoute';

const App = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		if (getCurrentUser()) {
			dispatch(asyncThunkGetUsersAddedIntoFavorites());
		}
	}, [dispatch]);

        return (
                <ThemeProvider>
                        <Suspense fallback={<div>Loading...</div>}>
                                <Routes>
				{/* страница для тестов (в конце проекта удаляется) */}
				<Route element={<Layout />}>
					<Route path='/test' element={<TestPage />} />
				</Route>

				{/* Главная страница с фильтрами */}
				<Route element={<LayoutWithFilters />}>
					<Route path='/' element={<HomePage />} />
				</Route>

				{/* Общий Layout с Header/Footer и условным Sidebar */}
				<Route element={<Layout />}>
					{/* Профиль и вложенные страницы */}
					<Route element={<PrivateRoute />}>
						<Route path='/profile'>
							<Route index element={<ProfilePage />} />
							<Route path='applications' element={<ApplicationsPage />} />
							<Route path='exchanges' element={<ExchangesPage />} />
							<Route path='favorites' element={<FavoritesPage />} />
							<Route path='skills' element={<MySkillsPage />} />
						</Route>
					</Route>

					{/* Страницы ошибок */}
					<Route path='/error-500' element={<Error500 />} />
					<Route path='*' element={<NotFound404 />} />
					<Route path='/skills/:id' element={<SkillPage />} />
				</Route>

				{/* Регистрация — отдельный layout без Header/Footer */}
                                <Route
                                        path='/register/*'
                                        element={
                                                <RegisterProvider>
                                                        <RegisterLayout />
                                                </RegisterProvider>
                                        }
                                >
					<Route index element={<RegisterStep1 />} />
					<Route path='step-1' element={<RegisterStep1 />} />
					<Route path='step-2' element={<RegisterStep2 />} />
					<Route path='step-3' element={<RegisterStep3 />} />
				</Route>

				{/* Страница логина */}
                                <Route path='/login' element={<LoginPage />} />
                        </Routes>
                        </Suspense>
                </ThemeProvider>
        );
};

export default App;
