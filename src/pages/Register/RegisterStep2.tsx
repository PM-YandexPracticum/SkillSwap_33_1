import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from '@/components/DatePicker/DatePicker';
import { useRegister } from './RegisterContext';
import { useTheme } from '../../app/styles/ThemeProvider';
import AddIconLight from '@icons/icon-add-light.svg?react';
import AddIconDark from '@icons/icon-add-dark.svg?react';
import styles from './RegisterPage.module.css';
import { skillsCategories } from '../../shared/data/skillsCategories';
import genderData from '../../../public/db/gender.json';
import citiesData from '../../../public/db/city.json';
import type { CitiesResponse } from '@/types';

const RegisterStep2 = () => {
	const navigate = useNavigate();
	const { setStep2Data } = useRegister();
	const { theme } = useTheme();

	const [name, setName] = useState('');
	const [birthDate, setBirthDate] = useState<Date | null>(null);
	const [gender, setGender] = useState('unspecified');
	const [isGenderOpen, setIsGenderOpen] = useState(false);
	const [city, setCity] = useState('');
	const [isCityOpen, setIsCityOpen] = useState(false);

	const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
	const [selectedSubcategories, setSelectedSubcategories] = useState<number[]>(
		[]
	);

	const [avatarFile, setAvatarFile] = useState<File | null>(null);
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const AddIcon = theme === 'light' ? AddIconLight : AddIconDark;
	const genders = genderData.genders;
	const cities = (citiesData as CitiesResponse).cities;

	const handleAvatarClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setAvatarFile(file);
			const previewUrl = URL.createObjectURL(file);
			setAvatarPreview(previewUrl);
		}
	};

	useEffect(() => {
		return () => {
			if (avatarPreview) {
				URL.revokeObjectURL(avatarPreview);
			}
		};
	}, [avatarPreview]);

	const [isCatOpen, setIsCatOpen] = useState(false);
	const [isSubcatOpen, setIsSubcatOpen] = useState(false);

	const catRef = useRef<HTMLDivElement>(null);
	const subcatRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (catRef.current && !catRef.current.contains(event.target as Node))
				setIsCatOpen(false);
			if (
				subcatRef.current &&
				!subcatRef.current.contains(event.target as Node)
			)
				setIsSubcatOpen(false);
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const toggleCategory = (id: number) => {
		setSelectedCategories((prev) => {
			const newCats = prev.includes(id)
				? prev.filter((c) => c !== id)
				: [...prev, id];
			setSelectedSubcategories((subs) =>
				subs.filter((subId) =>
					newCats.some((catId) =>
						skillsCategories
							.find((cat) => cat.id === catId)
							?.skills.some((skill) => skill.id === subId)
					)
				)
			);
			return newCats;
		});
	};

	const toggleSubcategory = (id: number) => {
		setSelectedSubcategories((prev) =>
			prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
		);
	};

	const availableSubcategories = skillsCategories
		.filter((cat) => selectedCategories.includes(cat.id))
		.flatMap((cat) => cat.skills);

	const selectedCategoriesNames =
		skillsCategories
			.filter((cat) => selectedCategories.includes(cat.id))
			.map((cat) => cat.name)
			.join(', ') || 'Выберите категорию';

	const selectedSubcategoriesNames =
		availableSubcategories
			.filter((sub) => selectedSubcategories.includes(sub.id))
			.map((sub) => sub.name)
			.join(', ') || 'Выберите подкатегорию';

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		setStep2Data({
			fullName: name,
			birthDate: birthDate
				? [
						birthDate.getFullYear(),
						String(birthDate.getMonth() + 1).padStart(2, '0'),
						String(birthDate.getDate()).padStart(2, '0'),
					].join('-')
				: undefined,
			gender,
			city,
			wantToLearnCategories: selectedCategories,
			wantToLearnSubcategories: selectedSubcategories,
			avatar: avatarFile || undefined,
		});

		navigate('/register/step-3');
	};

	const handleBack = () => navigate('/register/step-1');

	return (
		<form className={styles.form} onSubmit={handleSubmit}>
			<div className={styles.avatarUpload} onClick={handleAvatarClick}>
				{avatarPreview ? (
					<img
						src={avatarPreview}
						alt='Аватар'
						className={styles.avatarImage}
					/>
				) : (
					<AddIcon />
				)}
			</div>

			<input
				type='file'
				accept='image/*'
				ref={fileInputRef}
				onChange={handleFileChange}
				style={{ display: 'none' }}
			/>

			<label className={styles.inputLabel}>
				<span>Имя</span>
				<input
					className={styles.inputField}
					type='text'
					placeholder='Введите ваше имя'
					required
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
			</label>

			<div className={styles.row}>
				<label className={styles.inputLabel} style={{ flex: 1 }}>
					<span>Дата рождения</span>
					<div className={styles.customDateWrapper}>
						<DatePicker
							selected={birthDate}
							onChange={setBirthDate}
							placeholder='дд.мм.гггг'
						/>
					</div>
				</label>

				<label className={styles.inputLabel} style={{ flex: 1 }}>
					<span>Пол</span>
					<div
						className={styles.selectWrapper}
						aria-expanded={isGenderOpen ? 'true' : 'false'}
					>
						<select
							className={styles.inputField}
							value={gender}
							onChange={(e) => setGender(e.target.value)}
							onFocus={() => setIsGenderOpen(true)}
							onBlur={() => setIsGenderOpen(false)}
						>
							{genders.map((g) => (
								<option key={g.id} value={g.id}>
									{g.label}
								</option>
							))}
						</select>
					</div>
				</label>
			</div>

			<label className={styles.inputLabel}>
				<span>Город</span>
				<div
					className={styles.selectWrapper}
					aria-expanded={isCityOpen ? 'true' : 'false'}
				>
					<select
						className={styles.inputField}
						value={city}
						onChange={(e) => setCity(e.target.value)}
						onFocus={() => setIsCityOpen(true)}
						onBlur={() => setIsCityOpen(false)}
					>
						<option value=''>Не указан</option>
						{cities.map((c) => (
							<option key={c.id} value={c.id}>
								{c['city-name']}
							</option>
						))}
					</select>
				</div>
			</label>

			<label className={styles.inputLabel}>
				<span>Категория навыка, которому хотите научиться</span>
				<div
					className={styles.customDropdown}
					ref={catRef}
					tabIndex={0}
					onClick={() => setIsCatOpen((v) => !v)}
					role='button'
					aria-haspopup='listbox'
					aria-expanded={isCatOpen}
				>
					<div className={styles.dropdownSelected}>
						{selectedCategoriesNames}
					</div>
					{isCatOpen && (
						<ul className={styles.dropdownList}>
							{skillsCategories.map((cat) => (
								<li key={cat.id} className={styles.dropdownItem}>
									<label>
										<input
											type='checkbox'
											checked={selectedCategories.includes(cat.id)}
											onChange={() => toggleCategory(cat.id)}
											onClick={(e) => e.stopPropagation()}
										/>{' '}
										{cat.name}
									</label>
								</li>
							))}
						</ul>
					)}
				</div>
			</label>

			<label className={styles.inputLabel}>
				<span>Подкатегория навыка, которому хотите научиться</span>
				<div
					className={styles.customDropdown}
					ref={subcatRef}
					tabIndex={0}
					onClick={() => setIsSubcatOpen((v) => !v)}
					role='button'
					aria-haspopup='listbox'
					aria-expanded={isSubcatOpen}
				>
					<div className={styles.dropdownSelected}>
						{selectedSubcategoriesNames}
					</div>
					{isSubcatOpen && (
						<ul className={styles.dropdownList}>
							{availableSubcategories.length === 0 && (
								<li className={styles.dropdownItem}>
									Выберите сначала категории
								</li>
							)}
							{availableSubcategories.map((sub) => (
								<li key={sub.id} className={styles.dropdownItem}>
									<label>
										<input
											type='checkbox'
											checked={selectedSubcategories.includes(sub.id)}
											onChange={() => toggleSubcategory(sub.id)}
											onClick={(e) => e.stopPropagation()}
										/>{' '}
										{sub.name}
									</label>
								</li>
							))}
						</ul>
					)}
				</div>
			</label>

			<div className={styles.row}>
				<button
					type='button'
					onClick={handleBack}
					className={`${styles.button} ${styles.buttonBack}`}
				>
					Назад
				</button>
				<button
					type='submit'
					className={`${styles.button} ${styles.buttonPrimary}`}
				>
					Продолжить
				</button>
			</div>
		</form>
	);
};

export default RegisterStep2;
