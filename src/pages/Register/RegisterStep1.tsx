import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RegisterPage.module.css';
import { useRegister } from './RegisterContext';
import GoogleIcon from '@icons/google.svg?react';
import AppleLightIcon from '@icons/apple-light.svg?react';
import AppleDarkIcon from '@icons/apple-dark.svg?react';
import EyeIcon from '@icons/eye.svg?react';
import EyeSlashIcon from '@icons/eye-slash.svg?react';
import { useTheme } from '@/app/styles/ThemeProvider';

const RegisterStep1 = () => {
	const { theme } = useTheme();
	const AppleIcon = theme === 'dark' ? AppleDarkIcon : AppleLightIcon;
	const navigate = useNavigate();
	const { setStep1Data } = useRegister();

	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [passwordError, setPasswordError] = useState<string | null>(null);
	const [emailError, setEmailError] = useState<string | null>(null); // Для ошибок email
	const [passwordStrength, setPasswordStrength] = useState<string | null>(null);

	const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

	const validatePassword = (password: string) => {
		if (password.length < 8) {
			setPasswordStrength(null);
			setPasswordError('Пароль должен содержать не менее 8 знаков');
		} else {
			setPasswordError(null);
			setPasswordStrength('Надежный');
		}
	};

	const validateEmail = (email: string) => {
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		if (!email) {
			setEmailError('Email не может быть пустым');
		} else if (!emailRegex.test(email)) {
			setEmailError('Введите корректный email');
		} else {
			setEmailError(null);
		}
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newPassword = e.target.value;
		setPassword(newPassword);
		validatePassword(newPassword);
	};

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newEmail = e.target.value;
		setEmail(newEmail);
		validateEmail(newEmail);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!emailError && !passwordError) {
			setStep1Data({ email, password });
			navigate('/register/step-2');
		}
	};

	return (
		<>
			<div className={styles.socialBtnContainer}>
				<button className={`${styles.button} ${styles.socialBtn}`}>
					<GoogleIcon />
					Продолжить с Google
				</button>
				<button className={`${styles.button} ${styles.socialBtn}`}>
					<AppleIcon />
					Продолжить с Apple
				</button>
			</div>

			<div className={styles.divider}>
				<span>или</span>
			</div>

			<form className={styles.form} onSubmit={handleSubmit}>
				{/* Поле Email с ошибкой */}
				<label className={styles.passwordWrapper}>
					<span>Email</span>
					<div className={styles.inputWithIcon}>
						<input
							type='email'
							placeholder='Введите email'
							required
							value={email}
							onChange={handleEmailChange}
							className={styles.input}
						/>
					</div>
					{emailError && <p className={styles.emailError}>{emailError}</p>}
				</label>

				<label className={styles.passwordWrapper}>
					<span>Пароль</span>
					<div className={styles.inputWithIcon}>
						<input
							type={showPassword ? 'text' : 'password'}
							placeholder='Придумайте надёжный пароль'
							required
							value={password}
							onChange={handlePasswordChange}
							className={styles.input}
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
					{passwordError && (
						<p className={styles.passwordError}>{passwordError}</p>
					)}
					{passwordStrength && (
						<p className={styles.passwordStrength}>{passwordStrength}</p>
					)}
				</label>

				<button
					type='submit'
					className={`${styles.button} ${styles.buttonPrimary}`}
					disabled={!!emailError || !!passwordError} // Отключаем кнопку, если есть ошибки
				>
					Далее
				</button>
			</form>
		</>
	);
};

export default RegisterStep1;
