import styles from './Loader.module.css';

// eslint-disable-next-line react/function-component-definition
export default function Loader() {
	return (
		<div className={styles.wrapper}>
			<span className={styles.loader} aria-label='Загрузка' />
		</div>
	);
}
