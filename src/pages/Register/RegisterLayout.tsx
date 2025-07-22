import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import styles from './RegisterPage.module.css';
import Logo from '@/components/Logo/Logo';
import CrossIcon from '@icons/cross.svg?react';

const infoContent = {
	'step-1': {
		img: '/assets/images/light-bulb.svg',
		title: 'Добро пожаловать в SkillSwap!',
		text: 'Обменивайтесь знаниями и навыками с другими людьми',
		stepNumber: 1,
	},
	'step-2': {
		img: '/assets/images/user-info.svg',
		title: 'Расскажите немного о себе',
		text: 'Это поможет другим людям лучше вас узнать',
		stepNumber: 2,
	},
	'step-3': {
		img: '/assets/images/school-board.svg',
		title: 'Укажите, чем вы готовы поделиться',
		text: 'Так другие люди смогут найти вас для обмена навыками',
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

	const { img, title, text, stepNumber } = infoContent[step];

	return (
		<div className={styles['auth-page']}>
			<div className={styles['auth-top-bar']}>
				<Logo />
				<button className={styles['auth-close']} onClick={handleClose}>
					Закрыть
					<CrossIcon className={styles['auth-close-icon']} />
				</button>
			</div>

			{/* Надпись с номером шага, по центру над колонками */}
			<h2 className={styles['step-indicator']}>Шаг {stepNumber} из 3</h2>

			<div className={styles['auth-card']}>
				<div className={styles['auth-form-section']}>
					<Outlet />
				</div>

				<div className={styles['auth-info-section']}>
					<img src={img} alt={title} className={styles['info-image']} />
					<h3>{title}</h3>
					<p>{text}</p>
				</div>
			</div>
		</div>
	);
};

export default RegisterLayout;
