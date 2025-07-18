import { HomePage, NotFound404 } from '@/pages';
import '@appStyles/fonts.css';
import '@appStyles/normalize.css';
import '@appStyles/global.css';

import { Route, Routes } from 'react-router-dom';

const App = () => {
	return (
		<>
			<Routes /*location={backgroundLocation || location}*/>
				<Route /*element={<Layout />}*/>
					<Route path='/' element={<HomePage />} />
					<Route path='*' element={<NotFound404 />} />
				</Route>
			</Routes>
		</>
	);
};

export default App;
