import type { Cities, CitiesResponse } from '../types';

const URL = '';

export const getCities = async (): Promise<Cities> => {
	const response = await fetch(`${URL}/db/city.json`);
	if (!response.ok) {
		throw new Error('Не удалость загрузить города. ' + response.status);
	}

	const data = (await response.json()) as CitiesResponse;
	return data.cities;
};
