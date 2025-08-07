import * as yup from 'yup';

export const loginValidationSchema = yup.object({
	email: yup
		.string()
		.trim()
		.required('Email не может быть пустым')
		.email('Введите корректный email'),
	password: yup
		.string()
		.required('Пароль не может быть пустым')
		.min(8, 'Пароль должен содержать не менее 8 знаков'),
});
