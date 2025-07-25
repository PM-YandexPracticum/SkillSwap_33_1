import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RegisterPage.module.css';
import { useRegister } from './RegisterContext';
import GoogleIcon from '@icons/google.svg?react';
import AppleLightIcon from '@icons/apple-light.svg?react';
import AppleDarkIcon from '@icons/apple-dark.svg?react';
import EyeIcon from '@icons/eye.svg?react';
import EyeSlashIcon from '@icons/eye-slash.svg?react';

const RegisterStep1 = () => {
	const navigate = useNavigate();
	const { setStep1Data } = useRegister();

	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setStep1Data({ email, password });
		navigate('/register/step-2');
	};

	// Получаем текущую тему из <html data-theme="light|dark">
	const theme = document.documentElement.getAttribute('data-theme') ?? 'light';
	const AppleIcon = theme === 'dark' ? AppleDarkIcon : AppleLightIcon;

	return (
		<>
			<div className={styles.socialBtnContainer}>
				<button className={`${styles.socialBtn} ${styles.button}`}>
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
				<label className={styles.inputLabel}>
					<span>Email</span>
					<input
						type='email'
						placeholder='Введите email'
						required
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className={styles.input}
					/>
				</label>

				<label className={styles.passwordWrapper}>
					<span>Пароль</span>
					<div className={styles.inputWithIcon}>
						<input
							type={showPassword ? 'text' : 'password'}
							placeholder='Придумайте надёжный пароль'
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
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
