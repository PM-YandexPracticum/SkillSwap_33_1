import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthForm.model';
import styles from './LoginPage.module.css';
import Logo from '@/components/Logo/Logo';
import CrossIcon from '@icons/cross.svg?react';
import GoogleIcon from '@icons/google.svg?react';
import AppleLightIcon from '@icons/apple-light.svg?react';
import AppleDarkIcon from '@icons/apple-dark.svg?react';
import EyeIcon from '@icons/eye.svg?react';
import EyeSlashIcon from '@icons/eye-slash.svg?react';
import { useTheme } from '@/app/styles/ThemeProvider';
import {
	validateEmail,
	validatePassword,
} from '@/shared/lib/validation/auth.validation';

const LoginPage = () => {
	const { theme } = useTheme();
	const navigate = useNavigate();
	const { login } = useAuth();
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});
	const [showPassword, setShowPassword] = useState(false);
	const [emailError, setEmailError] = useState<string | null>(null);
	const [passwordError, setPasswordError] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		setError(null);

		if (name === 'email') {
			setEmailError(validateEmail(value));
		} else if (name === 'password') {
			setPasswordError(validatePassword(value));
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const emailErr = validateEmail(formData.email);
		const passwordErr = validatePassword(formData.password);

		setEmailError(emailErr);
		setPasswordError(passwordErr);

		if (emailErr || passwordErr) {
			setError('Пожалуйста, исправьте ошибки в форме');
			return;
		}

		setIsLoading(true);
		setError(null);

		const success = login(formData.email, formData.password);
		setIsLoading(false);

		if (success) {
			navigate('/profile');
		} else {
			setError(
				'Email или пароль введён неверно. Пожалуйста, проверьте правильность введённых данных.'
			);
		}
	};

	// Тема для картинки
	const infoImagePath = `/assets/images/light-bulb-${theme}.svg`;
	const AppleIcon = theme === 'dark' ? AppleDarkIcon : AppleLightIcon;

	return (
		<div className={styles.page}>
			<div className={styles.topBar}>
				<Logo />
				<button className={styles.closeBtn} onClick={() => navigate('/')}>
					Закрыть
					<CrossIcon />
				</button>
			</div>
			<div className={styles.authTitleContainer}>
				<h2 className={styles.authTitle}>Вход</h2>
			</div>
			<div className={styles.card}>
				<div className={styles.section}>
					<div className={styles.socialBtnContainer}>
						<button className={styles.socialBtn} type='button'>
							<GoogleIcon />
							Продолжить с Google
						</button>
						<button className={styles.socialBtn} type='button'>
							<AppleIcon />
							Продолжить с Apple
						</button>
					</div>

					<div className={styles.divider}>
						<span>или</span>
					</div>

					<form className={styles.form} onSubmit={handleSubmit} noValidate>
						<label className={styles.inputLabel}>
							Email
							<input
								type='email'
								name='email'
								className={`${styles.inputField} ${
									emailError ? styles.inputInvalid : ''
								}`}
								placeholder='Введите email'
								value={formData.email}
								onChange={handleChange}
								required
							/>
						</label>
						{emailError && <p className={styles.errorMessage}>{emailError}</p>}

						<label className={styles.inputLabel}>
							Пароль
							<div
								className={`${styles.inputWithIcon} ${
									passwordError ? styles.inputWithIconInvalid : ''
								}`}
							>
								<input
									type={showPassword ? 'text' : 'password'}
									name='password'
									className={`${styles.inputField} ${
										passwordError ? styles.inputInvalid : ''
									}`}
									placeholder='Введите пароль'
									value={formData.password}
									onChange={handleChange}
									required
								/>
								<button
									type='button'
									className={styles.eyeIcon}
									onClick={() => setShowPassword(!showPassword)}
									aria-label={
										showPassword ? 'Скрыть пароль' : 'Показать пароль'
									}
								>
									{showPassword ? <EyeSlashIcon /> : <EyeIcon />}
								</button>
							</div>
						</label>
						{passwordError && (
							<p className={styles.errorMessage}>{passwordError}</p>
						)}

						{error && <div className={styles.errorMessage}>{error}</div>}

						<div className={styles.containerBtn}>
							<button
								type='submit'
								className={`${styles.button} ${styles.buttonPrimary}`}
								disabled={isLoading}
							>
								{isLoading ? 'Загрузка...' : 'Войти'}
							</button>

							<div style={{ textAlign: 'center', marginTop: 16 }}>
								<button
									type='button'
									className={styles.uploadLabel}
									onClick={() => navigate('/register')}
								>
									Зарегистрироваться
								</button>
							</div>
						</div>
					</form>
				</div>

				<div className={styles.section}>
					<div className={styles.infoContent}>
						<img
							src={infoImagePath}
							alt='Добро пожаловать'
							className={styles.infoImage}
							onError={() =>
								console.error('Ошибка загрузки изображения:', infoImagePath)
							}
						/>
						<div className={styles.infoText}>
							<h3 className={styles.sectionTitle}>
								С возвращением в SkillSwap!
							</h3>
							<p className={styles.sectionText}>
								Обменивайтесь знаниями и навыками с другими людьми
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
