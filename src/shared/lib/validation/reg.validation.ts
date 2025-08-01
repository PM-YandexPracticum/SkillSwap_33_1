export const validateEmail = (email: string): string | null => {
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	if (!email.trim()) {
		return 'Email не может быть пустым';
	} else if (!emailRegex.test(email)) {
		return 'Введите корректный email';
	}
	return null;
};

export const validatePassword = (password: string): string | null => {
	if (password.length < 8) {
		return 'Пароль должен содержать не менее 8 знаков';
	}
	return null;
};
