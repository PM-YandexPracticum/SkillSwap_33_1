import React, { useState, useEffect } from 'react';
import {
	useAuth,
	getStoredUsers,
	saveUsers,
} from '@/features/auth/AuthForm.model';
import { SkillsAPI } from '@/api/skills.api';
import type { UserCardData, UserDetailData } from '@/entities/user/user';
import './MySkillsPage.css';
import { SkillExchangeCard } from '@/widgets/SkillExchangeCard/SkillExchangeCard';
import { Button } from '@/shared/ui/button';
import AddMySkillModal from './AddMySkillModal';
import {
	RegisterProvider,
	useRegister,
} from '@/pages/Register/RegisterContext';
import { skillsCategories } from '@/shared/data/skillsCategories';

// Сжимает изображение и возвращает dataURL
const compressImage = (file: File): Promise<string> => {
	return new Promise((resolve) => {
		const reader = new FileReader();
		reader.onloadend = () => {
			const img = new Image();
			img.onload = () => {
				const canvas = document.createElement('canvas');
				const MAX_SIZE = 800;
				let { width, height } = img;
				if (width > height && width > MAX_SIZE) {
					height = (height * MAX_SIZE) / width;
					width = MAX_SIZE;
				} else if (height > MAX_SIZE) {
					width = (width * MAX_SIZE) / height;
					height = MAX_SIZE;
				}
				canvas.width = width;
				canvas.height = height;
				const ctx = canvas.getContext('2d');
				ctx?.drawImage(img, 0, 0, width, height);
				resolve(canvas.toDataURL('image/jpeg', 0.7));
			};
			img.src = reader.result as string;
		};
		reader.readAsDataURL(file);
	});
};

const MySkillsContent: React.FC = () => {
	const { user } = useAuth();
	const { setCategories } = useRegister();
	const [userCard, setUserCard] = useState<UserCardData | null>(null);
	const [userDetail, setUserDetail] = useState<UserDetailData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		setCategories(skillsCategories);
	}, [setCategories]);

	useEffect(() => {
		const loadUserSkills = async () => {
			if (!user?.id) {
				setError('Пользователь не найден');
				setIsLoading(false);
				return;
			}

			try {
				setIsLoading(true);
				setError(null);

				SkillsAPI.clearCache();

				const users = await SkillsAPI.getUsers();
				const currentUser = users.find((u) => u.id === `usr_${user.id}`);

				if (!currentUser) {
					setError('Данные пользователя не найдены');
					setIsLoading(false);
					return;
				}

				setUserCard(currentUser);

				const userDetailData = await SkillsAPI.getOfferById(`usr_${user.id}`);
				setUserDetail(userDetailData);
			} catch (err) {
				console.error('Ошибка при загрузке навыков:', err);
				setError('Не удалось загрузить данные о навыках');
			} finally {
				setIsLoading(false);
			}
		};

		loadUserSkills();
	}, [user?.id]);

	const handleAddSkill = async (data: any) => {
		setIsModalOpen(false);
		if (!user?.id) return;

		// подготавливаем изображения
		let skillImages: string[] = [];
		if (data.files && data.files.length > 0) {
			const promises = Array.from(data.files).map((file: File) =>
				compressImage(file)
			);
			skillImages = await Promise.all(promises);
		} else {
			skillImages = [
				'https://i.ibb.co/rGKcmVB7/matheus-farias-Tf-F9it7bidc-unsplash.jpg',
				'https://i.ibb.co/zhXFPnYY/ashe-walker-91st-Dm-TERL4-unsplash.jpg',
				'https://i.ibb.co/fGQ1SC5s/mathilde-langevin-s-Z-WM4c-Ol-M-unsplash.jpg',
			];
		}

		const storedUsers = getStoredUsers();
		const idx = storedUsers.findIndex((u) => u.id === user.id);
		if (idx !== -1) {
			const u = storedUsers[idx];
			u.canTeachSubcategories = Array.from(
				new Set([
					...(u.canTeachSubcategories || []),
					...data.canTeachSubcategories,
				])
			);
			u.canTeachCategories = Array.from(
				new Set([...(u.canTeachCategories || []), ...data.canTeachCategories])
			);
			u.skillDescriptionsBySubcategory = u.skillDescriptionsBySubcategory || {};
			u.skillImagesBySubcategory = u.skillImagesBySubcategory || {};
			u.skillsCanTeach = u.skillsCanTeach || [];
			data.canTeachSubcategories.forEach((subId: number) => {
				u.skillDescriptionsBySubcategory![subId] = data.description;
				u.skillImagesBySubcategory![subId] = skillImages;
				const existing = u.skillsCanTeach!.find(
					(s: { subcategoryId: number }) => s.subcategoryId === subId
				);
				const skillData = {
					subcategoryId: subId,
					description: data.description,
					images: skillImages,
				};
				if (existing) {
					Object.assign(existing, skillData);
				} else {
					u.skillsCanTeach!.push(skillData);
				}
			});
			storedUsers[idx] = u;
			saveUsers(storedUsers);
		}

		const tempCards = JSON.parse(
			localStorage.getItem('temp_user_cards') || '[]'
		);
		const cardIdx = tempCards.findIndex((c: any) => c.id === `usr_${user.id}`);
		if (cardIdx !== -1) {
			const card = tempCards[cardIdx];
			card.skillsCanTeach = card.skillsCanTeach || [];
			card.canTeachSubcategories = Array.from(
				new Set([
					...(card.canTeachSubcategories || []),
					...data.canTeachSubcategories,
				])
			);
			card.canTeachCategories = Array.from(
				new Set([
					...(card.canTeachCategories || []),
					...data.canTeachCategories,
				])
			);
			data.canTeachSubcategories.forEach((subId: number) => {
				const skills = card.skillsCanTeach;
				const sIdx = skills.findIndex((s: any) => s.subcategoryId === subId);
				const skillData = {
					subcategoryId: subId,
					description: data.description,
					images: skillImages,
				};
				if (sIdx !== -1) skills[sIdx] = skillData;
				else skills.push(skillData);
			});
			tempCards[cardIdx] = card;
			localStorage.setItem('temp_user_cards', JSON.stringify(tempCards));
		}

		SkillsAPI.clearCache();
		const users = await SkillsAPI.getUsers();
		setUserCard(users.find((u) => u.id === `usr_${user.id}`) || null);
		const detail = await SkillsAPI.getOfferById(`usr_${user.id}`);
		setUserDetail(detail);
	};

	if (isLoading) {
		return (
			<div className='my-skills-container'>
				<div className='my-skills-content'>
					<div className='loading'>Загрузка...</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='my-skills-container'>
				<div className='my-skills-content'>
					<div className='error-message'>{error}</div>
				</div>
			</div>
		);
	}

	return (
		<div className='my-skills-container'>
			<div className='my-skills-content'>
				{!userCard ||
				!userDetail ||
				!userDetail.skillsCanTeach ||
				userDetail.skillsCanTeach.length === 0 ? (
					<>
						<h2>У вас пока нет навыков</h2>
						<p>Добавьте навыки, которыми вы можете поделиться с другими</p>
						<Button onClick={() => setIsModalOpen(true)}>
							+ Добавить навык
						</Button>
					</>
				) : (
					<SkillExchangeCard
						userId={userDetail.id}
						skill={{
							id: userDetail.id,
							title: userDetail.skillsCanTeach[0].title,
							category: userDetail.skillsCanTeach[0].category,
							description: userDetail.skillsCanTeach[0].description,
							images: userDetail.skillsCanTeach[0].images,
						}}
						showExchangeButton={false}
						showEditButton={false}
						showHeaderButtons={false}
					/>
				)}
				<AddMySkillModal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					onConfirm={handleAddSkill}
				/>
			</div>
		</div>
	);
};

const MySkillsPage: React.FC = () => (
	<RegisterProvider>
		<MySkillsContent />
	</RegisterProvider>
);

export default MySkillsPage;
