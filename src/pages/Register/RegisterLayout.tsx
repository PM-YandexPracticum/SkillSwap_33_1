import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import styles from './RegisterPage.module.css';
import Logo from '@/components/Logo/Logo';
import CrossIcon from '@icons/cross.svg?react';
import StepLine1 from '@icons/step-1-line.svg?react';
import StepLine2 from '@icons/step-2-line.svg?react';
import StepLine3 from '@icons/step-3-line.svg?react';

const infoContent = {
	'step-1': {
		img: '/assets/images/light-bulb.svg',
		title: 'Добро пожаловать в SkillSwap!',
		text: 'Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми',
		stepNumber: 1,
	},
	'step-2': {
		img: '/assets/images/user-info.svg',
		title: 'Расскажите немного о себе',
		text: 'Это поможет другим людям лучше вас узнать, чтобы выбрать для обмена',
		stepNumber: 2,
	},
	'step-3': {
		img: '/assets/images/school-board.svg',
		title: 'Укажите, чем вы готовы поделиться',
		text: 'Так другие люди смогут увидеть ваши предложения и предложить вам обмен!',
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
		<div className={styles.page}>
			<div className={styles.topBar}>
				<Logo />
				<button className={styles.closeBtn} onClick={handleClose}>
					Закрыть
					<CrossIcon />
				</button>
			</div>

			<div className={styles.stepIndicator}>
				<h2 className={styles.stepText}>Шаг {stepNumber} из 3</h2>
				<div className={styles.stepLine}>
					{stepNumber === 1 && <StepLine1 />}
					{stepNumber === 2 && <StepLine2 />}
					{stepNumber === 3 && <StepLine3 />}
				</div>
			</div>

			<div className={styles.card}>
				<div className={styles.section}>
					<Outlet />
				</div>

				<div className={styles.section}>
					<div className={styles.infoContent}>
						<img src={img} alt={title} className={styles.infoImage} />
						<div className={styles.infoText}>
							<h3 className={styles.sectionTitle}>{title}</h3>
							<p className={styles.sectionText}>{text}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RegisterLayout;
