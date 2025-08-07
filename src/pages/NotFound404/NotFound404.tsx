import { useNavigate } from 'react-router-dom';
import styles from './NotFound404.module.css';

export const NotFound404 = () => {
	const navigate = useNavigate();

	// Получаем текущую тему из <html data-theme="...">
	const theme = document.documentElement.getAttribute('data-theme') ?? 'light';
	const error404Image = `/assets/images/error-404-${theme}.svg`;

	return (
		<div className={styles.content}>
                        <img
                                className={styles.image}
                                src={error404Image}
                                alt='Error 404 - Page not found'
                                loading='lazy'
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
				<button
					className={`${styles.onMainButton} ${styles.commonButton}`}
					onClick={() => navigate('/')}
				>
					На главную
				</button>
			</div>
		</div>
        );
};

export default NotFound404;
