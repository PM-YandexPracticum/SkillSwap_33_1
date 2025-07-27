import Logo from '../Logo/Logo';
import './Footer.css';
import { useTheme } from '@/app/styles/ThemeProvider';

const Footer = () => {
	const { theme } = useTheme();

	return (
		<footer className={`footer footer--${theme}`}>
			<div className='footer-container'>
				<div className='footer-header'>
					<Logo />
				</div>

				<div className='footer-links'>
					<div>
						<ul>
							<li>
								<a href='#' className='footer-link'>
									О проекте
								</a>
							</li>
							<li>
								<a href='#' className='footer-link'>
									Все навыки
								</a>
							</li>
						</ul>
					</div>
					<div>
						<ul>
							<li>
								<a href='#' className='footer-link'>
									Контакты
								</a>
							</li>
							<li>
								<a href='#' className='footer-link'>
									Блог
								</a>
							</li>
						</ul>
					</div>
					<div>
						<ul>
							<li>
								<a href='#' className='footer-link'>
									Политика конфиденциальности
								</a>
							</li>
							<li>
								<a href='#' className='footer-link'>
									Пользовательское соглашение
								</a>
							</li>
						</ul>
					</div>
				</div>

				<div>
					<p className='footer-copyright'>SkillSwap — 2025</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
