import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import styles from './RegisterPage.module.css';
import { useRegister } from './RegisterContext';
import { getStoredUsers } from '@/features/auth/AuthForm.model';

import { useTheme } from '@/app/styles/ThemeProvider';
import GoogleIcon from '@icons/google.svg?react';
import AppleLightIcon from '@icons/apple-light.svg?react';
import AppleDarkIcon from '@icons/apple-dark.svg?react';
import EyeIcon from '@icons/eye.svg?react';
import EyeSlashIcon from '@icons/eye-slash.svg?react';

import { registerStep1Schema } from '@/shared/lib/validation/reg.validation';

interface RegisterFormData {
	email: string;
	password: string;
}

const RegisterStep1 = () => {
	const { theme } = useTheme();
	const AppleIcon = theme === 'dark' ? AppleDarkIcon : AppleLightIcon;
	const navigate = useNavigate();
	const { setStep1Data } = useRegister();

	const [showPassword, setShowPassword] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
		watch,
	} = useForm<RegisterFormData>({
		resolver: yupResolver(registerStep1Schema),
		mode: 'onChange',
	});

	const passwordValue = watch('password');
	const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

	const onSubmit = (data: RegisterFormData) => {
		const users = getStoredUsers();
		if (users.some((u) => u.email === data.email)) {
			setError('email', {
				type: 'manual',
				message: 'Пользователь с таким email уже зарегистрирован',
			});
			return;
		}

		setStep1Data(data);
		navigate('/register/step-2');
	};

	return (
		<>
			<div className={styles.socialBtnContainer}>
				<button
					className={`${styles.button} ${styles.socialBtn}`}
					type='button'
				>
					<GoogleIcon />
					Продолжить с Google
				</button>
				<button
					className={`${styles.button} ${styles.socialBtn}`}
					type='button'
				>
					<AppleIcon />
					Продолжить с Apple
				</button>
			</div>

			<div className={styles.divider}>
				<span>или</span>
			</div>

			<form
				className={styles.form}
				onSubmit={handleSubmit(onSubmit)}
				noValidate
			>
				<label className={styles.passwordWrapper}>
					<span>Email</span>
					<div
						className={`${styles.inputWithIcon} ${
							errors.email ? styles.inputWithIconInvalid : ''
						}`}
					>
						<input
							type='email'
							placeholder='Введите email'
							{...register('email')}
							className={`${styles.inputField} ${errors.email ? styles.inputInvalid : ''}`}
							required
						/>
					</div>
					{errors.email && (
						<p className={styles.errorMessage}>{errors.email.message}</p>
					)}
				</label>

				<label className={styles.passwordWrapper}>
					<span>Пароль</span>
					<div
						className={`${styles.inputWithIcon} ${
							errors.password ? styles.inputWithIconInvalid : ''
						}`}
					>
						<input
							type={showPassword ? 'text' : 'password'}
							placeholder='Придумайте надёжный пароль'
							{...register('password')}
							className={styles.input}
							required
						/>
						<button
							type='button'
							onClick={togglePasswordVisibility}
							className={styles.eyeIcon}
							aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
						>
							{showPassword ? <EyeSlashIcon /> : <EyeIcon />}
						</button>
					</div>
					{errors.password && (
						<p className={styles.errorMessage}>{errors.password.message}</p>
					)}
					{passwordValue && !errors.password && (
						<p className={styles.passwordStrength}>Надёжный</p>
					)}
				</label>

				<button
					type='submit'
					className={`${styles.button} ${styles.buttonPrimary}`}
				>
					Далее
				</button>
			</form>
		</>
	);
};

export default RegisterStep1;
