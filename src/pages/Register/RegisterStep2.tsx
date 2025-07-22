import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from './RegisterContext';
import AddIcon from '@icons/icon-add.svg?react';
import CalendarIcon from '@icons/calendar.svg?react';
import CustomDatePicker from './CustomDatePicker';
import styles from './RegisterPage.module.css';

const RegisterStep2 = () => {
	const navigate = useNavigate();
	const { data, setStep2Data } = useRegister();

	const [fullName, setFullName] = useState(data.fullName || '');
	const [birthDate, setBirthDate] = useState<Date | null>(
		data.birthDate ? new Date(data.birthDate) : null
	);
	const [tempDate, setTempDate] = useState<Date | null>(birthDate);
	const [isCalendarOpen, setCalendarOpen] = useState(false);

	const [gender, setGender] = useState(data.gender || 'Не указан');
	const [city, setCity] = useState(data.city || '');
	const [skillCategory, setSkillCategory] = useState(data.skillCategory || '');
	const [skillSubcategory, setSkillSubcategory] = useState(
		data.skillSubcategory || ''
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setStep2Data({
			fullName,
			birthDate: birthDate?.toISOString() || '',
			gender,
			city,
			skillCategory,
			skillSubcategory,
		});
		navigate('/register/step-3');
	};

	const handleBack = () => navigate('/register/step-1');

	return (
		<>
			<AddIcon />

			<form className={styles['auth-form']} onSubmit={handleSubmit}>
				<label>
					<span>Имя</span>
					<input
						type='text'
						placeholder='Введите ваше имя'
						value={fullName}
						onChange={(e) => setFullName(e.target.value)}
						required
					/>
				</label>

				<div className={styles['row']}>
					<label className={styles['field-with-icon']}>
						<span>Дата рождения</span>
						<div
							className={styles['input-icon-wrapper']}
							onClick={() => setCalendarOpen(true)}
						>
							<input
								type='text'
								readOnly
								value={birthDate ? birthDate.toLocaleDateString('ru-RU') : ''}
								placeholder='дд.мм.гггг'
							/>
							<span className={styles['icon-calendar']}>
								<CalendarIcon />
							</span>
						</div>
					</label>

					<label className={styles['field-with-icon']}>
						<span>Пол</span>
						<select
							value={gender}
							onChange={(e) => setGender(e.target.value)}
							className={styles['select']}
						>
							<option>Не указан</option>
							<option>Мужской</option>
							<option>Женский</option>
						</select>
					</label>
				</div>

				{isCalendarOpen && (
					<CustomDatePicker
						selectedDate={birthDate}
						tempDate={tempDate}
						setTempDate={setTempDate}
						setFinalDate={setBirthDate}
						onClose={() => setCalendarOpen(false)}
					/>
				)}

				<label>
					<span>Город</span>
					<input
						type='text'
						placeholder='Не указан'
						value={city}
						onChange={(e) => setCity(e.target.value)}
					/>
				</label>

				<label>
					<span>Категория навыка, которому хотите научиться</span>
					<select
						value={skillCategory}
						onChange={(e) => setSkillCategory(e.target.value)}
					>
						<option value=''>Выберите категорию</option>
						<option>Программирование</option>
						<option>Дизайн</option>
					</select>
				</label>

				<label>
					<span>Подкатегория навыка, которому хотите научиться</span>
					<select
						value={skillSubcategory}
						onChange={(e) => setSkillSubcategory(e.target.value)}
					>
						<option value=''>Выберите подкатегорию</option>
						<option>Frontend</option>
						<option>UX/UI</option>
					</select>
				</label>

				<div className={styles['form-buttons']}>
					<button
						type='button'
						onClick={handleBack}
						className={`${styles.button} ${styles['button-outline']}`}
					>
						Назад
					</button>
					<button
						type='submit'
						className={`${styles.button} ${styles['button-primary']}`}
					>
						Продолжить
					</button>
				</div>
			</form>
		</>
	);
};

export default RegisterStep2;
