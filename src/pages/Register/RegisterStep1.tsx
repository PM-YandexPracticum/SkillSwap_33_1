import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RegisterPage.module.css';
import { useRegister } from './RegisterContext';
import GoogleIcon from '@icons/google.svg?react';
import AppleIcon from '@icons/apple.svg?react';
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

	return (
		<>
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
							placeholder='Придумайте надёжный пароль'
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<button
							type='button'
							onClick={togglePasswordVisibility}
							className={styles['eye-icon']}
							aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
						>
							{showPassword ? <EyeSlashIcon /> : <EyeIcon />}
						</button>
					</div>
				</label>

				<button
					type='submit'
					className={`${styles.button} ${styles['button-primary']}`}
				>
					Далее
				</button>
			</form>
		</>
	);
};

export default RegisterStep1;
