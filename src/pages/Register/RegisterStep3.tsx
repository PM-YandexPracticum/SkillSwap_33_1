import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RegisterPage.module.css';
import { useRegister } from './RegisterContext';

const RegisterStep3 = () => {
	const navigate = useNavigate();
	const { setStep3Data } = useRegister();

	const [skillName, setSkillName] = useState('');
	const [category, setCategory] = useState('');
	const [subcategory, setSubcategory] = useState('');
	const [description, setDescription] = useState('');
	const [files, setFiles] = useState<FileList | null>(null);

	const handleBack = () => navigate('/register/step-2');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setStep3Data({ skillName, description, files });
		navigate('/profile');
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFiles(e.target.files);
	};

	return (
		<>
			<form className={styles['auth-form']} onSubmit={handleSubmit}>
				<label>
					<span>Название навыка</span>
					<input
						type='text'
						placeholder='Введите название вашего навыка'
						value={skillName}
						onChange={(e) => setSkillName(e.target.value)}
						required
					/>
				</label>

				<label>
					<span>Категория навыка</span>
					<select
						value={category}
						onChange={(e) => setCategory(e.target.value)}
						required
					>
						<option value=''>Выберите категорию навыка</option>
						<option value='design'>Дизайн</option>
						<option value='programming'>Программирование</option>
						<option value='languages'>Языки</option>
					</select>
				</label>

				<label>
					<span>Подкатегория навыка</span>
					<select
						value={subcategory}
						onChange={(e) => setSubcategory(e.target.value)}
						required
					>
						<option value=''>Выберите подкатегорию навыка</option>
						<option value='uiux'>UI/UX</option>
						<option value='frontend'>Frontend</option>
						<option value='english'>Английский</option>
					</select>
				</label>

				<label>
					<span>Описание</span>
					<textarea
						placeholder='Коротко опишите, чему можете научить'
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						required
					/>
				</label>

				<label className={styles['file-upload']}>
					<span>Выберите изображения навыка</span>
					<input
						type='file'
						accept='image/*'
						multiple
						onChange={handleFileChange}
					/>
				</label>

				<div className={styles['form-buttons']}>
					<button
						type='button'
						className={`${styles.button} ${styles['button-outline']}`}
						onClick={handleBack}
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

export default RegisterStep3;
