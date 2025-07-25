import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';
import Logo from '@/components/Logo/Logo';
import CrossIcon from '@icons/cross.svg?react';
import GoogleIcon from '@icons/google.svg?react';
import AppleIcon from '@icons/apple.svg?react';
import EyeIcon from '@icons/eye.svg?react';
import EyeSlashIcon from '@icons/eye-slash.svg?react';

const LoginPage = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Здесь будет логика входа
		console.log('Login data:', { email, password });
		navigate('/profile');
	};

	const togglePasswordVisibility = () => setShowPassword(!showPassword);
	const handleClose = () => navigate('/');

	return (
		<div className={styles['auth-page']}>
			<div className={styles['auth-top-bar']}>
				<Logo />
				<button className={styles['auth-close']} onClick={handleClose}>
					Закрыть
					<CrossIcon className={styles['auth-close-icon']} />
				</button>
			</div>

			<div className={styles['auth-card']}>
				<div className={styles['auth-form-section']}>
					<button className={`${styles['social-button']} ${styles.google}`}>
						<GoogleIcon className={styles.icon} />
						Продолжить с Google
					</button>
					<button className={`${styles['social-button']} ${styles.apple}`}>
						<AppleIcon className={styles.icon} />
						Продолжить с Apple
					</button>

					<div className={styles.divider}>
						<span>или</span>
					</div>

					<form className={styles['auth-form']} onSubmit={handleSubmit}>
						<label>
							<span>Email</span>
							<input
								type='email'
								placeholder='Введите email'
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</label>

						<label className={styles['password-wrapper']}>
							<span>Пароль</span>
							<div className={styles['input-with-icon']}>
								<input
									type={showPassword ? 'text' : 'password'}
									placeholder='Введите пароль'
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
								<button
									type='button'
									onClick={togglePasswordVisibility}
									className={styles['eye-icon']}
								>
									{showPassword ? <EyeSlashIcon /> : <EyeIcon />}
								</button>
							</div>
						</label>

						<button
							type='submit'
							className={`${styles.button} ${styles['button-primary']}`}
						>
							Войти
						</button>

						<div className={styles['register-link']}>
							<button
								type='button'
								className={styles['link-button']}
								onClick={() => navigate('/register')}
							>
								Зарегистрироваться
							</button>
						</div>
					</form>
				</div>

				<div className={styles['auth-info-section']}>
					<img
						src='/assets/images/light-bulb.svg'
						alt='Добро пожаловать'
						className={styles['info-image']}
					/>
					<h3>С возвращением в SkillSwap!</h3>
					<p>Обменивайтесь знаниями и навыками с другими людьми</p>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
