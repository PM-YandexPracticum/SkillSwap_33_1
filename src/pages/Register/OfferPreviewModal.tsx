import React from 'react';
import styles from './OfferPreviewModal.module.css';
import { Button } from '@/shared/ui/button/button';
import EditIcon from '@/shared/assets/icons/edit.svg?react';
import { useRegister } from './RegisterContext';

interface OfferPreviewModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	onEdit: () => void;
}

const OfferPreviewModal: React.FC<OfferPreviewModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	onEdit,
}) => {
	const { data, categories } = useRegister();

	// Создаем превью изображений
	const [imageUrls, setImageUrls] = React.useState<string[]>([]);

	React.useEffect(() => {
		if (isOpen && data.files) {
			const urls: string[] = [];
			Array.from(data.files).forEach((file) => {
				urls.push(URL.createObjectURL(file));
			});
			setImageUrls(urls);
		}

		// Очистка URL объектов при размонтировании или закрытии модала
		return () => {
			imageUrls.forEach((url) => URL.revokeObjectURL(url));
		};
	}, [isOpen, data.files, imageUrls]);

	if (!isOpen) return null;

	// Получаем названия категорий и подкатегорий
	const selectedCategoryIds = data.canTeachCategories || [];
	const selectedSubcategoryIds = data.canTeachSubcategories || [];

	const selectedCategories = categories
		.filter((cat) => selectedCategoryIds.includes(cat.id))
		.map((cat) => cat.name);

	const selectedSubcategories = categories
		.flatMap((cat) => cat.skills)
		.filter((skill) => selectedSubcategoryIds.includes(skill.id))
		.map((skill) => skill.name);

	const categoryPath =
		selectedCategories.length > 0 && selectedSubcategories.length > 0
			? `${selectedCategories.join(', ')} / ${selectedSubcategories.join(', ')}`
			: '';

	return (
		<div className={styles.overlay} onClick={onClose}>
			<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
				<div className={styles.header}>
					<h2 className={styles.title}>Ваше предложение</h2>
					<p className={styles.subtitle}>
						Пожалуйста, проверьте и подтвердите правильность данных
					</p>
				</div>

				<div className={styles.content}>
					<div className={styles.leftSection}>
						<h3 className={styles.skillName}>{data.skillName}</h3>
						<p className={styles.category}>{categoryPath}</p>
						<p className={styles.description}>{data.description}</p>

						<div className={styles.actions}>
							<Button
								variant='outlined'
								onClick={onEdit}
								className={styles.editButton}
							>
								<EditIcon />
								Редактировать
							</Button>
							<Button
								variant='primary'
								onClick={onConfirm}
								className={styles.confirmButton}
							>
								Готово
							</Button>
						</div>
					</div>

					<div className={styles.rightSection}>
						{imageUrls.length > 0 && (
							<div className={styles.imageGrid}>
								{imageUrls.length === 1 && (
									<img
										src={imageUrls[0]}
										className={styles.image}
										alt='Изображение навыка'
									/>
								)}
								{imageUrls.length > 1 && (
									<>
										<img
											src={imageUrls[0]}
											className={styles.image}
											alt='Основное изображение'
										/>
										{imageUrls.slice(1, 4).map((url, idx) => (
											<div className={styles.smallImageWrapper} key={idx}>
												<img
													src={url}
													className={styles.image}
													alt={`Изображение ${idx + 2}`}
												/>
												{idx === 2 && imageUrls.length > 4 && (
													<div className={styles.imageCounter}>
														+{imageUrls.length - 4}
													</div>
												)}
											</div>
										))}
									</>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default OfferPreviewModal;
