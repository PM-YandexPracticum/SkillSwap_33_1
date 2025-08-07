import React, { useState, useEffect, useRef } from 'react';
import styles from './AddMySkillModal.module.css';
import { Button } from '@/shared/ui/button/button';
import { useRegister } from '@/pages/Register/RegisterContext';

interface AddMySkillModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (data: any) => void;
}

const AddMySkillModal: React.FC<AddMySkillModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
}) => {
	const { categories } = useRegister();

	const [skillName, setSkillName] = useState('');
	const [categoryIds, setCategoryIds] = useState<number[]>([]);
	const [subcategoryIds, setSubcategoryIds] = useState<number[]>([]);
	const [description, setDescription] = useState('');
	const [files, setFiles] = useState<FileList | null>(null);

	const [isCatOpen, setIsCatOpen] = useState(false);
	const [isSubcatOpen, setIsSubcatOpen] = useState(false);
	const catRef = useRef<HTMLDivElement>(null);
	const subcatRef = useRef<HTMLDivElement>(null);

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

	const availableSubcategories = categories
		.filter((cat) => categoryIds.includes(cat.id))
		.flatMap((cat) => cat.skills);

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

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const selectedFiles = Array.from(e.target.files).slice(0, 4);
			const dataTransfer = new DataTransfer();
			selectedFiles.forEach((file) => dataTransfer.items.add(file));
			setFiles(dataTransfer.files);
		}
	};

	const handleConfirm = () => {
		const skillData = {
			skillName,
			description,
			files,
			canTeachCategories: categoryIds,
			canTeachSubcategories: subcategoryIds,
		};

		onConfirm(skillData);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className={styles.overlay} onClick={onClose}>
			<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
				<form className={styles.form}>
					<h2 className={styles.title}>Добавить навык</h2>

					<label className={styles.inputLabel}>
						<span>Название навыка</span>
						<input
							type='text'
							className={styles.inputField}
							value={skillName}
							onChange={(e) => setSkillName(e.target.value)}
						/>
					</label>

					<label className={styles.inputLabel}>
						<span>Категория навыка</span>
						<div
							className={styles.customDropdown}
							ref={catRef}
							tabIndex={0}
							onClick={() => setIsCatOpen((v) => !v)}
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
						>
							<div className={styles.dropdownSelected}>
								{selectedSubcategoriesNames}
							</div>
							{isSubcatOpen && (
								<ul className={styles.dropdownList}>
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
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder='Коротко опишите, чему можете научить'
						/>
					</label>

					<label className={styles.inputLabel}>
						<span>Загрузить изображения (до 4 файлов)</span>
						<input
							type='file'
							accept='image/*'
							multiple
							onChange={handleFileChange}
							className={styles.fileInput}
						/>
						{files && (
							<ul className={styles.uploadFileList}>
								{Array.from(files).map((file, idx) => (
									<li key={idx}>{file.name}</li>
								))}
							</ul>
						)}
					</label>

					<div className={styles.actions}>
						<Button variant='secondary' onClick={onClose}>
							Отмена
						</Button>
						<Button variant='primary' onClick={handleConfirm}>
							Готово
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default AddMySkillModal;
