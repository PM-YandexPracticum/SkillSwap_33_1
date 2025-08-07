import { useNavigate } from 'react-router-dom';
import styles from './Error500.module.css';
import { Header } from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

export const Error500 = () => {
	const navigate = useNavigate();

	// Получаем тему
	const theme = document.documentElement.getAttribute('data-theme') ?? 'light';
	const error500Image = `/assets/images/error-500-${theme}.svg`;

	return (
		<>
			<Header variant='guest' />
			<div className={styles.content}>
				<img
					className={styles.image}
					src={error500Image}
					alt='Error 500 - Internal Server Error'
					loading='lazy'
				/>
				<div className={styles.error}>
					<h2 className={styles.title}>На сервере произошла ошибка</h2>
					<p className={styles.message}>
						Попробуйте позже или вернитесь на главную страницу
					</p>
				</div>
				<div className={styles.buttons}>
					<button className={`${styles.reportButton} ${styles.commonButton}`}>
						Сообщить об ошибке
					</button>
					<button
						className={`${styles.onMainButton} ${styles.commonButton}`}
						onClick={() => navigate('/')}
					>
						На главную
					</button>
				</div>
			</div>
			<Footer />
		</>
	);
};

export default Error500;
