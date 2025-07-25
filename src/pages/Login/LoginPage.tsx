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
		console.log('Login data:', { email, password });
		navigate('/profile');
	};

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
						<button className={styles.socialBtn}>
							<GoogleIcon />
							Продолжить с Google
						</button>
						<button className={styles.socialBtn}>
							<AppleIcon />
							Продолжить с Apple
						</button>
					</div>

					<div className={styles.divider}>
						<span>или</span>
					</div>

					<form className={styles.form} onSubmit={handleSubmit}>
						<label className={styles.inputLabel}>
							Email
							<input
								type='email'
								className={styles.inputField}
								placeholder='Введите email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</label>

						<label className={styles.inputLabel}>
							Пароль
							<div className={styles.inputWithIcon}>
								<input
									type={showPassword ? 'text' : 'password'}
									placeholder='Введите пароль'
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
								<button
									type='button'
									className={styles.eyeIcon}
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? <EyeSlashIcon /> : <EyeIcon />}
								</button>
							</div>
						</label>
						<div className={styles.containerBtn}>
							<button
								type='submit'
								className={`${styles.button} ${styles.buttonPrimary}`}
							>
								Войти
							</button>

							<div style={{ textAlign: 'center', marginTop: '16px' }}>
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
							src='/assets/images/light-bulb.svg'
							alt='Добро пожаловать'
							className={styles.infoImage}
						/>
						<div className={styles.infoText}>
							<h3 className={styles.sectionTitle}>
								С возвращением в SkillSwap!
							</h3>
							<p className={styles.sectionText}>
								Обменийвайтесь знаниями и навыками с другими людьми
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
