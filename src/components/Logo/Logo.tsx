import './Logo.css';
import logoImage from '../../shared/assets/icons/logo.png';

const Logo = () => {
	return (
		<div className='logo'>
			<img src={logoImage} alt='SkillSwap Logo' className='logo-image' />
			<span className='logo-text'>SkillSwap</span>
		</div>
	);
};

export default Logo;
