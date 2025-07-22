import { HomePage, NotFound404 } from '@/pages';
import '@appStyles/fonts.css';
import '@appStyles/normalize.css';
import '@appStyles/global.css';
import '@appStyles/theme.css';

import { Route, Routes } from 'react-router-dom';
import ProfilePage from '@/pages/Profile/ProfilePage';
import ProfileLayout from '@/pages/Profile/ProfileLayout';
import PlaceholderPage from '@/pages/Profile/PlaceholderPage';

import { ThemeProvider } from '@app/styles/ThemeProvider';

const App = () => {
	return (
		<ThemeProvider>
			<Routes /*location={backgroundLocation || location}*/>
				<Route path='/' element={<HomePage />} />
				<Route path='*' element={<NotFound404 />} />
				<Route path='/profile' element={<ProfileLayout />}>
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
					<Route
						path='favorites'
						element={
							<PlaceholderPage
								title='Избранное'
								description='Ваши избранные навыки и пользователи'
							/>
						}
					/>
					<Route
						path='skills'
						element={
							<PlaceholderPage
								title='Мои навыки'
								description='Управление вашими навыками и их описанием'
							/>
						}
					/>
				</Route>
			</Routes>
		</ThemeProvider>
	);
};

export default App;
