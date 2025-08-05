import { HomePage, NotFound404, FavoritesPage } from '@/pages';
import { Error500 } from '@/pages/Error500/Error500';
import '@appStyles/fonts.css';
import '@appStyles/normalize.css';
import '@appStyles/global.css';
import '@appStyles/theme.css';

import { Route, Routes } from 'react-router-dom';

import ProfilePage from '@/pages/Profile/ProfilePage';
import PlaceholderPage from '@/pages/Profile/PlaceholderPage';
import MySkillsPage from '@/pages/Profile/MySkillsPage';

import RegisterLayout from '@/pages/Register/RegisterLayout';
import RegisterStep1 from '@/pages/Register/RegisterStep1';
import RegisterStep2 from '@/pages/Register/RegisterStep2';
import RegisterStep3 from '@/pages/Register/RegisterStep3';
import { RegisterProvider } from '@/pages/Register/RegisterContext';
import LoginPage from '@/pages/Login/LoginPage';
import { SkillPage } from '@/pages';

import { Layout } from '@/widgets/Layout/Layout';
import { LayoutWithFilters } from '@/widgets/Layout/LayoutWithFilters';
import { ThemeProvider } from '@app/styles/ThemeProvider';
import { TestPage } from '@/pages/TestPage/TestPage';

const App = () => {
	return (
		<ThemeProvider>
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
					<Route>
						<Route path='/profile'>
							<Route index element={<ProfilePage />} />
							<Route
								path='applications'
								element={
									<PlaceholderPage
										title='Заявки'
										description='Здесь будут отображаться ваши заявки на обмен навыками'
									/>
								}
							/>
							<Route
								path='exchanges'
								element={
									<PlaceholderPage
										title='Мои обмены'
										description='Здесь вы увидите все ваши активные и завершенные обмены'
									/>
								}
							/>
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
		</ThemeProvider>
	);
};

export default App;
