import React, { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/AuthForm.model';
import { SkillsAPI } from '@/api/skills.api';
import type { UserCardData, UserDetailData } from '@/entities/user/user';
import './MySkillsPage.css';

const MySkillsPage: React.FC = () => {
	const { user } = useAuth();
	const [userCard, setUserCard] = useState<UserCardData | null>(null);
	const [userDetail, setUserDetail] = useState<UserDetailData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

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

				// Получаем данные пользователя для отображения карточки
				const users = await SkillsAPI.getUsers();
				const currentUser = users.find((u) => u.id === `usr_${user.id}`);

				if (!currentUser) {
					setError('Данные пользователя не найдены');
					setIsLoading(false);
					return;
				}

				setUserCard(currentUser);

				// Получаем детальную информацию о навыках пользователя
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

	if (!userCard || !userDetail) {
		return (
			<div className='my-skills-container'>
				<div className='my-skills-content'>
					<div className='no-skills'>
						<h2>У вас пока нет навыков</h2>
						<p>Добавьте навыки, которыми вы можете поделиться с другими</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='my-skills-container'>
			<div className='my-skills-content'>
				<div className='my-skills-main'>
					<div className='left-section'>
						<h3 className='skill-name'>
							{userDetail.skillsCanTeach[0]?.title || 'Название навыка'}
						</h3>
						<p className='category'>
							{userDetail.skillsCanTeach[0]?.category || 'Категория'}
						</p>
						<p className='description'>
							{userDetail.description || 'Описание навыка'}
						</p>
					</div>

					<div className='right-section'>
						{/* Изображения навыка */}
						{userDetail.skillsCanTeach[0]?.images &&
							userDetail.skillsCanTeach[0].images.length > 0 && (
								<div className='image-grid'>
									{userDetail.skillsCanTeach[0].images.length === 1 && (
										<img
											src={userDetail.skillsCanTeach[0].images[0]}
											className='image'
											alt='Изображение навыка'
										/>
									)}
									{userDetail.skillsCanTeach[0].images.length > 1 && (
										<>
											<img
												src={userDetail.skillsCanTeach[0].images[0]}
												className='image'
												alt='Основное изображение'
											/>
											{userDetail.skillsCanTeach[0].images
												.slice(1, 4)
												.map((image, idx) => (
													<div className='small-image-wrapper' key={idx}>
														<img
															src={image}
															className='image'
															alt={`Изображение ${idx + 2}`}
														/>
														{idx === 2 &&
															userDetail.skillsCanTeach[0].images.length >
																4 && (
																<div className='image-counter'>
																	+
																	{userDetail.skillsCanTeach[0].images.length -
																		4}
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

export default MySkillsPage;
