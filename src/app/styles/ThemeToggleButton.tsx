import { useTheme } from '@/app/styles/ThemeProvider';
import MoonIcon from '@/shared/assets/icons/moon.svg?react';
import SunIcon from '@/shared/assets/icons/sun.svg?react';

interface ThemeToggleButtonProps {
	className?: string;
}

const ThemeToggleButton = ({ className }: ThemeToggleButtonProps) => {
	const { theme, toggleTheme } = useTheme();

	return (
		<button
			onClick={toggleTheme}
			className={className}
			aria-label='Переключить тему'
		>
			{theme === 'light' ? (
				<MoonIcon className='w-5 h-5' />
			) : (
				<SunIcon className='w-5 h-5' />
			)}
		</button>
	);
};

export default ThemeToggleButton;
