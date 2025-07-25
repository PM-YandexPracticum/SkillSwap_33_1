import styles from './HomePage.module.css';
import ClockIcon from '@icons/clock.svg?react';
import EditIcon from '@icons/edit.svg?react';
import BookIcon from '@icons/book.svg?react';
import { useTheme } from '../../app/styles/ThemeProvider';

export const HomePage = () => {
	const { theme } = useTheme();

	const error404Image =
		theme === 'dark'
			? 'assets/images/error-404-dark.svg'
			: 'assets/images/error-404-light.svg';

	const error500Image =
		theme === 'dark'
			? 'assets/images/error-500-dark.svg'
			: 'assets/images/error-500-light.svg';

	return (
		<>
			<h1 className={styles.heading}>Home Page</h1>
			<div>
				<img src='assets/icons/testIcon.svg' alt='' />
				<img src={error404Image} alt='Error 404' />
				<img src={error500Image} alt='Error 500' />
				<img src='assets/images/light-bulb.svg' alt='' />
			</div>
			<div>
				<a className={styles.link} href='#'>
					<ClockIcon className={styles.icon} />
				</a>
				<a className={styles.link} href='#'>
					<BookIcon className={styles.icon} />
				</a>
				<a className={styles.link} href='#'>
					<EditIcon className={styles.icon} />
				</a>
			</div>
		</>
	);
};
