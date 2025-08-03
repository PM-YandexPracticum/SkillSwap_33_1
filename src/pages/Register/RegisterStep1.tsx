import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RegisterPage.module.css';
import { useRegister } from './RegisterContext';
import { getStoredUsers } from '@/features/auth/AuthForm.model';
import GoogleIcon from '@icons/google.svg?react';
import AppleLightIcon from '@icons/apple-light.svg?react';
import AppleDarkIcon from '@icons/apple-dark.svg?react';
import EyeIcon from '@icons/eye.svg?react';
import EyeSlashIcon from '@icons/eye-slash.svg?react';
import { useTheme } from '@/app/styles/ThemeProvider';
import {
	validateEmail,
	validatePassword,
} from '@/shared/lib/validation/reg.validation';

const RegisterStep1 = () => {
	const { theme } = useTheme();
	const AppleIcon = theme === 'dark' ? AppleDarkIcon : AppleLightIcon;
	const navigate = useNavigate();
	const { setStep1Data } = useRegister();

	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [emailError, setEmailError] = useState<string | null>(null);
	const [passwordError, setPasswordError] = useState<string | null>(null);
	const [passwordStrength, setPasswordStrength] = useState<string | null>(null);

	const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newPassword = e.target.value;
		setPassword(newPassword);

		const error = validatePassword(newPassword);
		setPasswordError(error);
		setPasswordStrength(error ? null : 'Надежный');
	};

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newEmail = e.target.value;
		setEmail(newEmail);

		const error = validateEmail(newEmail);
		setEmailError(error);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Повторная проверка при сабмите
		const emailValidationResult = validateEmail(email);
		const passwordValidationResult = validatePassword(password);

		setEmailError(emailValidationResult);
		setPasswordError(passwordValidationResult);
		setPasswordStrength(passwordValidationResult ? null : 'Надежный');

                if (!emailValidationResult && !passwordValidationResult) {
                        const users = getStoredUsers();
                        if (users.some((u) => u.email === email)) {
                                setEmailError('Пользователь с таким email уже зарегистрирован');
                                return;
                        }
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
				<label className={styles.passwordWrapper}>
					<span>Email</span>
					<div
						className={`${styles.inputWithIcon} ${emailError ? styles.inputWithIconInvalid : ''}`}
					>
						<input
							type='email'
							placeholder='Введите email'
							required
							value={email}
							onChange={handleEmailChange}
							className={`${styles.inputField} ${emailError ? styles.inputInvalid : ''}`}
						/>
					</div>
					{emailError && <p className={styles.errorMessage}>{emailError}</p>}
				</label>

				<label className={styles.passwordWrapper}>
					<span>Пароль</span>
					<div
						className={`${styles.inputWithIcon} ${passwordError ? styles.inputWithIconInvalid : ''}`}
					>
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
						<p className={styles.errorMessage}>{passwordError}</p>
					)}
					{passwordStrength && (
						<p className={styles.passwordStrength}>{passwordStrength}</p>
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
