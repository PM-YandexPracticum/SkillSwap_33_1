import { useTheme } from '../../app/styles/ThemeProvider';
import styles from './NotFound404.module.css';
import { Header } from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

export const NotFound404 = () => {
	const { theme } = useTheme();

	const error404Image =
		theme === 'dark'
			? 'assets/images/error-404-dark.svg'
			: 'assets/images/error-404-light.svg';

	return (
		<>
			<Header variant='guest' />
			<div className={styles.content}>
				<img
					className={styles.image}
					src={error404Image}
					alt='Error 404 - Page not found'
				/>
				<div className={styles.error}>
					<h2 className={styles.title}>Страница не найдена</h2>
					<p className={styles.message}>
						К сожалению, эта страница недоступна. Вернитесь на главную страницу
						или попробуйте позже
					</p>
				</div>
				<div className={styles.buttons}>
					<button className={`${styles.reportButton} ${styles.commonButton}`}>
						Сообщить об ошибке
					</button>
					<button className={`${styles.onMainButton} ${styles.commonButton}`}>
						На главную
					</button>
				</div>
			</div>
			<Footer />
		</>
	);
};
