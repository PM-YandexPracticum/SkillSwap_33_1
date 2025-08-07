import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthForm.model';
import { useDispatch } from '@/app/providers/store/StoreProvider';
import { asyncThunkGetUsersAddedIntoFavorites } from '@/entities/slices/favoritesSlice';
import styles from './LoginPage.module.css';
import Logo from '@/components/Logo/Logo';
import CrossIcon from '@icons/cross.svg?react';
import GoogleIcon from '@icons/google.svg?react';
import AppleLightIcon from '@icons/apple-light.svg?react';
import AppleDarkIcon from '@icons/apple-dark.svg?react';
import EyeIcon from '@icons/eye.svg?react';
import EyeSlashIcon from '@icons/eye-slash.svg?react';
import { useTheme } from '@/app/styles/ThemeProvider';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginValidationSchema } from '@/shared/lib/validation/auth.validation';

interface LoginFormData {
	email: string;
	password: string;
}

const LoginPage = () => {
	const { theme } = useTheme();
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useDispatch();
	const { login } = useAuth();

	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormData>({
		resolver: yupResolver(loginValidationSchema),
		mode: 'onChange',
	});

	const onSubmit = (data: LoginFormData) => {
		setError(null);
		const success = login(data.email, data.password);

		if (success) {
			dispatch(asyncThunkGetUsersAddedIntoFavorites());
			const state = location.state as any;
			const from = state?.from || '/profile';
			navigate(from, { replace: true });
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

					<form
						className={styles.form}
						onSubmit={handleSubmit(onSubmit)}
						noValidate
					>
						<label className={styles.inputLabel}>
							Email
							<input
								type='email'
								{...register('email')}
								className={`${styles.inputField} ${errors.email ? styles.inputInvalid : ''}`}
								placeholder='Введите email'
								required
							/>
							{errors.email && (
								<p className={styles.errorMessage}>{errors.email.message}</p>
							)}
						</label>

						<label className={styles.inputLabel}>
							Пароль
							<div
								className={`${styles.inputWithIcon} ${
									errors.password ? styles.inputWithIconInvalid : ''
								}`}
							>
								<input
									type={showPassword ? 'text' : 'password'}
									{...register('password')}
									className={`${styles.inputField} ${errors.password ? styles.inputInvalid : ''}`}
									placeholder='Введите пароль'
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
							{errors.password && (
								<p className={styles.errorMessage}>{errors.password.message}</p>
							)}
							{error && <div className={styles.errorMessage}>{error}</div>}
						</label>

						<div className={styles.containerBtn}>
							<button
								type='submit'
								className={`${styles.button} ${styles.buttonPrimary}`}
								disabled={isSubmitting}
							>
								{isSubmitting ? 'Загрузка...' : 'Войти'}
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
