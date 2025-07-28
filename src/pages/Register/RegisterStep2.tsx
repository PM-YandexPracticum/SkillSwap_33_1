import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from '@/components/DatePicker/DatePicker';
import { useRegister } from './RegisterContext';
import { useTheme } from '../../app/styles/ThemeProvider';
import AddIconLight from '@icons/icon-add-light.svg?react';
import AddIconDark from '@icons/icon-add-dark.svg?react';
import styles from './RegisterPage.module.css';

const RegisterStep2 = () => {
	const navigate = useNavigate();
	const { setStep2Data } = useRegister();
	const { theme } = useTheme();

	const [name, setName] = useState('');
	const [birthDate, setBirthDate] = useState<Date | null>(null);
	const [gender, setGender] = useState('');
	const [city, setCity] = useState('');
	const [category, setCategory] = useState('');
	const [subcategory, setSubcategory] = useState('');

	const [avatarFile, setAvatarFile] = useState<File | null>(null);
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const AddIcon = theme === 'light' ? AddIconLight : AddIconDark;

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

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		setStep2Data({
			fullName: name,
			birthDate: birthDate ? birthDate.toISOString() : undefined,
			gender,
			city,
			skillCategory: category,
			skillSubcategory: subcategory,
			avatar: avatarFile || undefined,
		});

		navigate('/register/step-3');
	};

	const handleBack = () => navigate('/register/step-1');

	return (
		<>
			<form className={styles.form} onSubmit={handleSubmit}>
				<div className={styles.avatarUpload} onClick={handleAvatarClick}>
					{avatarPreview ? (
						<img
							src={avatarPreview}
							alt='Аватар'
							className={styles.avatarImage}
							style={{
								width: 64,
								height: 64,
								borderRadius: '50%',
								objectFit: 'cover',
							}}
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
						<select
							className={styles.inputField}
							value={gender}
							onChange={(e) => setGender(e.target.value)}
						>
							<option value=''>Не указан</option>
							<option value='Мужской'>Мужской</option>
							<option value='Женский'>Женский</option>
							<option value='Другое'>Другое</option>
						</select>
					</label>
				</div>

				<label className={styles.inputLabel}>
					<span>Город</span>
					<select
						className={styles.inputField}
						value={city}
						onChange={(e) => setCity(e.target.value)}
					>
						<option value=''>Не указан</option>
						<option value='Москва'>Москва</option>
						<option value='Санкт-Петербург'>Санкт-Петербург</option>
						<option value='Другое'>Другое</option>
					</select>
				</label>

				<label className={styles.inputLabel}>
					<span>Категория навыка, которому хотите научиться</span>
					<select
						className={styles.inputField}
						value={category}
						onChange={(e) => setCategory(e.target.value)}
					>
						<option value=''>Выберите категорию</option>
					</select>
				</label>

				<label className={styles.inputLabel}>
					<span>Подкатегория навыка, которому хотите научиться</span>
					<select
						className={styles.inputField}
						value={subcategory}
						onChange={(e) => setSubcategory(e.target.value)}
					>
						<option value=''>Выберите подкатегорию</option>
					</select>
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
		</>
	);
};

export default RegisterStep2;
