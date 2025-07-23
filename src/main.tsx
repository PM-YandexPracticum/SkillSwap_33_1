import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from '@/app/providers/store/StoreProvider';
import { BrowserRouter } from 'react-router-dom';
import App from '@app/App.tsx';
import { ThemeProvider } from '@/app/styles/ThemeProvider';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<Provider store={store}>
				<ThemeProvider>
					<App />
				</ThemeProvider>
			</Provider>
		</BrowserRouter>
	</StrictMode>
);
