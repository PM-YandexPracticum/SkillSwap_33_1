import { useState } from 'react';
import { useAuth, type AuthUser } from './AuthForm.model';

interface AuthFormProps {
	mode: 'login' | 'register';
	onSuccess?: () => void;
}

const AuthForm = ({ mode, onSuccess }: AuthFormProps) => {
	const { login, register } = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
                if (mode === 'login') {
                        if (login(email, password)) onSuccess?.();
                } else {
                        const user: AuthUser = { email, password };
                        if (register(user)) onSuccess?.();
                }
        };

	return (
		<form onSubmit={handleSubmit}>
			<input
				type='email'
				placeholder='Email'
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				required
			/>
			<input
				type='password'
				placeholder='Пароль'
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				required
			/>
			<button type='submit'>
				{mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
			</button>
		</form>
	);
};

export default AuthForm;
