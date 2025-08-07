import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';

import ChevronDownIcon from '@/shared/assets/icons/chevron-down.svg?react';
import BriefcaseIcon from '@/shared/assets/icons/briefcase.svg?react';
import GlobalIcon from '@/shared/assets/icons/global.svg?react';
import HomeIcon from '@/shared/assets/icons/home.svg?react';
import PaletteIcon from '@/shared/assets/icons/palette.svg?react';
import BookIcon from '@/shared/assets/icons/book.svg?react';
import LifestyleIcon from '@/shared/assets/icons/lifestyle.svg?react';

import './SkillsDropdown.css';

import { useAppDispatch, useAppSelector } from '@/app/providers/store/hooks';
import { toggleSkill } from '@/entities/slices/filtersSlice';
import { selectAllSkills } from '@/entities/slices/skillsSlice';

interface Skill {
	id: number;
	name: string;
}

interface SkillCategory {
	id: number;
	name: string;
	icon: string;
	color: string;
	skills: Skill[];
}

const iconComponents: Record<string, React.ReactNode> = {
	'briefcase.svg': <BriefcaseIcon />,
	'global.svg': <GlobalIcon />,
	'home.svg': <HomeIcon />,
	'palette.svg': <PaletteIcon />,
	'book.svg': <BookIcon />,
	'lifestyle.svg': <LifestyleIcon />,
};

const SkillsDropdown = () => {
	const [isOpen, setIsOpen] = useState(false);
	const buttonRef = useRef<HTMLButtonElement>(null);

	const dispatch = useAppDispatch();
	const allSkills = useAppSelector(selectAllSkills) as SkillCategory[];
	const navigate = useNavigate();

	const handleClickOutside = (event: MouseEvent) => {
		if (
			!buttonRef.current?.contains(event.target as Node) &&
			!(event.target as HTMLElement).closest('.skills-menu')
		) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const getIconComponent = (iconPath: string) => {
		const iconName = iconPath.split('/').pop() || '';
		return iconComponents[iconName] || <BriefcaseIcon />;
	};

	const dropdownMenu = (
		<div className='skills-menu'>
			{[allSkills.slice(0, 3), allSkills.slice(3)].map((group, index) => (
				<div className='skills-column' key={index}>
					{group.map((category) => (
						<div className='skills-category' key={category.name}>
							<div
								className='skills-category__icon-wrapper'
								style={{ backgroundColor: category.color }}
							>
								{getIconComponent(category.icon)}
							</div>
							<div className='skills-category__content'>
								<h3 className='skills-category__title'>{category.name}</h3>
								<ul className='skills-category__list'>
									{category.skills.map((skill) => (
										<li
											key={skill.id}
											className='skills-category__item'
											onClick={() => {
												dispatch(toggleSkill(skill.id));
												setIsOpen(false);
												navigate('/');
											}}
											style={{ cursor: 'pointer' }}
										>
											{skill.name}
										</li>
									))}
								</ul>
							</div>
						</div>
					))}
				</div>
			))}
		</div>
	);

	return (
		<div className='nav-dropdown'>
			<button
				className='nav-dropdown__toggle'
				onClick={() => setIsOpen((prev) => !prev)}
				ref={buttonRef}
			>
				Все навыки <ChevronDownIcon className='w-4 h-4' />
			</button>

			{isOpen && createPortal(dropdownMenu, document.body)}
		</div>
	);
};

export default SkillsDropdown;
