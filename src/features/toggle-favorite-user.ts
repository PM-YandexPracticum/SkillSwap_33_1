import { useState } from 'react';

export const useToggleFavorite = () => {
	const [isFavorite, setIsFavorite] = useState(false); // можно позже заменить на Redux

	const toggle = () => {
		setIsFavorite((prev) => !prev);
		//... Бизнес-логика для будущего запроса на сервер
	};

	return { isFavorite, toggle };
};
