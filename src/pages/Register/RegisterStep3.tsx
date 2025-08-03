import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RegisterPage.module.css';
import { useRegister } from './RegisterContext';
import GalleryAddIcon from '@icons/gallery-add.svg?react';
import { useAuth } from '@/features/auth/AuthForm.model';

const RegisterStep3 = () => {
	const navigate = useNavigate();
	const { data, setStep3Data, categories } = useRegister();
        const { register } = useAuth();

	const [skillName, setSkillName] = useState('');
	const [categoryIds, setCategoryIds] = useState<number[]>([]); // выбранные категории по id
	const [subcategoryIds, setSubcategoryIds] = useState<number[]>([]); // выбранные подкатегории по id
	const [description, setDescription] = useState('');
        const [files, setFiles] = useState<FileList | null>(null);
        const [error, setError] = useState<string | null>(null);
	const [isDragging, setIsDragging] = useState(false);

	// Управление открытиями кастомных дропдаунов
	const [isCatOpen, setIsCatOpen] = useState(false);
	const [isSubcatOpen, setIsSubcatOpen] = useState(false);

	const catRef = useRef<HTMLDivElement>(null);
	const subcatRef = useRef<HTMLDivElement>(null);

	// Закрываем дропдауны при клике вне
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (catRef.current && !catRef.current.contains(e.target as Node))
				setIsCatOpen(false);
			if (subcatRef.current && !subcatRef.current.contains(e.target as Node))
				setIsSubcatOpen(false);
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	// При смене категории сбрасываем подкатегории, которые не подходят
	useEffect(() => {
		setSubcategoryIds((subs) =>
			subs.filter((subId) =>
				categoryIds.some((catId) =>
					categories
						.find((cat) => cat.id === catId)
						?.skills.some((skill) => skill.id === subId)
				)
			)
		);
	}, [categoryIds, categories]);

	// Функции переключения выбора
	const toggleCategory = (id: number) => {
		setCategoryIds((prev) =>
			prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
		);
	};

	const toggleSubcategory = (id: number) => {
		setSubcategoryIds((prev) =>
			prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
		);
	};

	// Подкатегории, доступные для выбранных категорий
	const availableSubcategories = categories
		.filter((cat) => categoryIds.includes(cat.id))
		.flatMap((cat) => cat.skills);

	// Тексты выбранных категорий и подкатегорий для показа в селекте
	const selectedCategoriesNames =
		categories
			.filter((cat) => categoryIds.includes(cat.id))
			.map((cat) => cat.name)
			.join(', ') || 'Выберите категорию';

	const selectedSubcategoriesNames =
		availableSubcategories
			.filter((sub) => subcategoryIds.includes(sub.id))
			.map((sub) => sub.name)
			.join(', ') || 'Выберите подкатегорию';

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const stepData = {
			skillName,
			description,
                        canTeachCategories: categoryIds,
                        canTeachSubcategories: subcategoryIds,
		};

		setStep3Data({ ...stepData, files });

                const success = register({ ...data, ...stepData });

                if (success) {
                        navigate('/profile');
                } else {
                        setError('Пользователь с таким email уже зарегистрирован');
                }
	};

	const handleBack = () => navigate('/register/step-2');

	// Остальные обработчики загрузки файлов...

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setFiles(e.target.files);
		}
	};

	const triggerFileSelect = () => {
		document.getElementById('fileInput')?.click();
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(false);
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(false);
		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			setFiles(e.dataTransfer.files);
			e.dataTransfer.clearData();
		}
	};

	return (
		<form className={styles.form} onSubmit={handleSubmit}>
                        {error && <p className={styles.errorMessage}>{error}</p>}

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
							{categories.map((cat) => (
								<li key={cat.id} className={styles.dropdownItem}>
									<label>
										<input
											type='checkbox'
											checked={categoryIds.includes(cat.id)}
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
				<span>Подкатегория навыка</span>
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
											checked={subcategoryIds.includes(sub.id)}
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
