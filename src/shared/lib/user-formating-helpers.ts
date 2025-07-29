function calculateAge(birthDateString: string): number | null {
	let birthDate: Date;

	// Пытаемся распарсить разные форматы: DD-MM-YYYY, YYYY-MM-DD и др.
	if (birthDateString.includes('-')) {
		const parts = birthDateString.split('-');
		if (parts.length === 3) {
			// Проверяем формат: DD-MM-YYYY
			if (
				parts[0].length === 2 &&
				parts[1].length === 2 &&
				parts[2].length === 4
			) {
				birthDate = new Date(
					parseInt(parts[2], 10),
					parseInt(parts[1], 10) - 1,
					parseInt(parts[0], 10)
				);
			} else if (parts[0].length === 4) {
				// Формат YYYY-MM-DD
				birthDate = new Date(
					parseInt(parts[0], 10),
					parseInt(parts[1], 10) - 1,
					parseInt(parts[2], 10)
				);
			} else {
				return null;
			}
		} else {
			return null;
		}
	} else {
		return null;
	}

	if (isNaN(birthDate.getTime())) {
		return null;
	}

	const today = new Date();
	let age = today.getFullYear() - birthDate.getFullYear();
	const monthDiff = today.getMonth() - birthDate.getMonth();
	const dayDiff = today.getDate() - birthDate.getDate();

	if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
		age--;
	}

	return age;
}

// пример использования getRuUserAgeСonjugation(undefined, '2004-02-15') => 21 год
// или
// getRuUserAgeСonjugation(26) => 26 лет

export const getRuUserAgeСonjugation = ({
	age,
	birthday,
}: {
	age?: number;
	birthday?: string;
}): string => {
	// Если возраст не передан, вычисляем его по дате рождения
	const calculatedAge = age ?? (birthday ? calculateAge(birthday) : null);

	if (calculatedAge === null || calculatedAge < 0) {
		console.warn('Не удалось определить возраст');
		return 'возраст неизвестен';
	}

	const finalAge = calculatedAge;
	const lastDigit = finalAge % 10;
	const lastTwoDigits = finalAge % 100;

	let suffix = 'лет';

	if (lastDigit === 1 && lastTwoDigits !== 11) {
		suffix = 'год';
	} else if (
		[2, 3, 4].includes(lastDigit) &&
		![12, 13, 14].includes(lastTwoDigits)
	) {
		suffix = 'года';
	}

	return `${finalAge} ${suffix}`;
};
