import { useTheme } from '../../app/styles/ThemeProvider';
import React from 'react';

export const NotFound404 = () => {
	const { theme } = useTheme();

	const error404Image =
		theme === 'dark'
			? 'assets/images/error-404-dark.svg'
			: 'assets/images/error-404-light.svg';

	return (
		<>
			<h1>404</h1>
			<img src={error404Image} alt='Page not found' />
		</>
	);
};
