// функция склонения возраста (26 лет, 21 год)
export const getRuUserAgeСonjugation = (value: string | number): string => {
	const today = new Date();
	let age: number;
	const unknown = 'возраст неизвестен';

	if (typeof value === 'number') {
		if (value < 100) {
			age = value;
		} else {
			age = today.getFullYear() - value;
		}
	} else {
		const birthDate = new Date(value);
		if (isNaN(birthDate.getTime())) {
			return unknown;
		}

		age = today.getFullYear() - birthDate.getFullYear();
		const monthDiff = today.getMonth() - birthDate.getMonth();
		const dayDiff = today.getDate() - birthDate.getDate();

		if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
			age--;
		}
	}

	if (age < 0 || age > 150) {
		return unknown;
	}

	const last = age % 10;
	const lastTwo = age % 100;
	let yearsStr = 'лет';

	if (last === 1 && lastTwo !== 11) {
		yearsStr = 'год';
	} else if ([2, 3, 4].includes(last) && ![12, 13, 14].includes(lastTwo)) {
		yearsStr = 'года';
	}

	return `${age} ${yearsStr}`;
};
