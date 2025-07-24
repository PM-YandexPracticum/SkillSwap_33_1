// Кнопка добавления/удаления навыка в избранное

import { useToggleFavorite } from '../toggle-favorite-user';
import HeartFilled from 'shared/assets/icons/heart-filled.svg';
import HeartOutline from 'shared/assets/icons/heart-outline.svg';
import styles from './FavoriteButton.module.css';

export const ToggleFavoriteButton = () => {
	const { isFavorite, toggle } = useToggleFavorite();

	return (
		<button className={styles.button} onClick={toggle}>
			<img
				src={isFavorite ? HeartFilled : HeartOutline}
				alt={isFavorite ? 'В избранном' : 'Добавить в избранное'}
				className={styles.icon}
			/>
		</button>
	);
};
