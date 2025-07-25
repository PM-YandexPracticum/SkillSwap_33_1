import { useState } from 'react';
import type { DragEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RegisterPage.module.css';
import { useRegister } from './RegisterContext';
import GalleryAddIcon from '@icons/gallery-add.svg?react';

const RegisterStep3 = () => {
	const navigate = useNavigate();
	const { setStep3Data } = useRegister();

	const [skillName, setSkillName] = useState('');
	const [category, setCategory] = useState('');
	const [subcategory, setSubcategory] = useState('');
	const [description, setDescription] = useState('');
	const [files, setFiles] = useState<FileList | null>(null);
	const [isDragging, setIsDragging] = useState(false);

	const handleBack = () => navigate('/register/step-2');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setStep3Data({ skillName, description, files });
		navigate('/profile');
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setFiles(e.target.files);
		}
	};

	const triggerFileSelect = () => {
		document.getElementById('fileInput')?.click();
	};

	const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(false);
	};

	const handleDrop = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(false);
		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			setFiles(e.dataTransfer.files);
			e.dataTransfer.clearData();
		}
	};

	return (
		<form className={styles.form} onSubmit={handleSubmit}>
			<label className={styles.inputLabel}>
				<span>Название навыка</span>
				<input
					type='text'
					className={styles.inputField}
					placeholder='Введите название вашего навыка'
					value={skillName}
					onChange={(e) => setSkillName(e.target.value)}
					required
				/>
			</label>

			<label className={styles.inputLabel}>
				<span>Категория навыка</span>
				<select
					className={styles.inputField}
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

			<label className={styles.inputLabel}>
				<span>Подкатегория навыка</span>
				<select
					className={styles.inputField}
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

			<label className={styles.inputLabel}>
				<span>Описание</span>
				<textarea
					className={styles.textArea}
					placeholder='Коротко опишите, чему можете научить'
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					required
				/>
			</label>

			<div
				className={`${styles.uploadBox} ${isDragging ? styles.dragging : ''}`}
				onClick={triggerFileSelect}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
			>
				{!files && (
					<>
						<p className={styles.uploadText}>
							Перетащите или выберите изображения навыка
						</p>
						<div className={styles.uploadLabel}>
							<GalleryAddIcon />
							<span>Выбрать изображения</span>
						</div>
					</>
				)}

				{files && files.length > 0 && (
					<ul className={styles.uploadFileList}>
						{Array.from(files).map((file, index) => (
							<li key={index} className={styles.uploadFileItem}>
								<span className={styles.fileName}>{file.name}</span>
								<GalleryAddIcon
									className={styles.uploadIcon}
									onClick={triggerFileSelect}
									style={{ cursor: 'pointer' }}
									title='Изменить выбранные изображения'
								/>
							</li>
						))}
					</ul>
				)}

				<input
					id='fileInput'
					type='file'
					accept='image/*'
					multiple
					onChange={handleFileChange}
					hidden
				/>
			</div>

			<div className={styles.row}>
				<button
					type='button'
					className={`${styles.button} ${styles.buttonBack}`}
					onClick={handleBack}
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

export default RegisterStep3;
