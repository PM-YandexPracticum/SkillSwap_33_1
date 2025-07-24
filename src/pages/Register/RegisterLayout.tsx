import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import styles from './RegisterPage.module.css';
import Logo from '@/components/Logo/Logo';
import CrossIcon from '@icons/cross.svg?react';

const infoContent = {
	'step-1': {
		iconName: 'light-bulb',
		title: 'Добро пожаловать в SkillSwap!',
		text: 'Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми',
		stepNumber: 1,
	},
	'step-2': {
		iconName: 'user-info',
		title: 'Расскажите немного о себе',
		text: 'Это поможет другим людям лучше вас узнать, чтобы выбрать для обмена',
		stepNumber: 2,
	},
	'step-3': {
		iconName: 'school-board',
		title: 'Укажите, чем вы готовы поделиться',
		text: 'Так другие люди смогут увидеть ваши предложения и предложить вам обмен!',
		stepNumber: 3,
	},
} as const;

type StepKey = keyof typeof infoContent;

const RegisterLayout = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const handleClose = () => navigate('/');

	const stepRaw = location.pathname.split('/').pop() || 'step-1';
	const step: StepKey =
		stepRaw === 'step-1' || stepRaw === 'step-2' || stepRaw === 'step-3'
			? stepRaw
			: 'step-1';

	const stepData = infoContent[step];
	const { title, text, stepNumber } = stepData;

	const theme = document.documentElement.getAttribute('data-theme') ?? 'light';
	console.log('Текущая тема:', theme);

	const img =
		(stepData.iconName
			? `/assets/images/${stepData.iconName}-${theme}.svg`
			: stepData.img) ?? '';

	return (
		<div className={styles['auth-page']}>
			<div className={styles['auth-top-bar']}>
				<Logo />
				<button className={styles['auth-close']} onClick={handleClose}>
					Закрыть
					<CrossIcon className={styles['auth-close-icon']} />
				</button>
			</div>

			<h2 className={styles['step-indicator']}>Шаг {stepNumber} из 3</h2>

			<div className={styles['auth-card']}>
				<div className={styles['auth-form-section']}>
					<Outlet />
				</div>

				<div className={styles['auth-info-section']}>
					<img
						src={img}
						alt={title}
						className={styles['info-image']}
						onError={() => console.error('Ошибка загрузки изображения:', img)}
					/>
					<h3>{title}</h3>
					<p>{text}</p>
				</div>
			</div>
		</div>
	);
};

export default RegisterLayout;
