import { useState, useRef } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import './ProfilePage.css';
import EditIcon from '../../shared/assets/icons/edit.svg';
import ChevronDownIcon from '../../shared/assets/icons/chevron-down.svg?react';
import citiesData from '../../../public/db/city.json';
import genderData from '../../../public/db/gender.json';
import DatePicker from '@/components/DatePicker/DatePicker';
import type { CitiesResponse } from '@/types';
import { DEFAULT_AVATAR, useUser } from '@/shared/hooks/useUser';
import { useTheme } from '@/app/styles/ThemeProvider';

const cities = (citiesData as CitiesResponse).cities;
const genders = genderData.genders;

const ProfilePage = () => {
	const { theme } = useTheme();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
	const {
		email,
		name,
		birthDate,
		genderId,
		locationId,
		description,
		avatarUrl,
	} = useUser();
	const [formData, setFormData] = useState({
		email: email || '',
		name: name || '',
		birthDate: birthDate ? new Date(birthDate) : new Date(),
		genderId: genderId || 'unspecified',
		locationId: locationId || '',
		about: description || '',
	});

	const handleInputChange = (field: string, value: string | Date) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSave = () => {
		if (avatarPreview) {
			setAvatarPreview(null);
		}
	};

	const handleAvatarEditClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setAvatarPreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	// Динамическое определение классов в зависимости от темы
	const themeClass = theme === 'dark' ? 'dark' : 'light';

	return (
		<div className={`profile-container ${themeClass}`}>
			<div className='profile-content'>
				<div className='profile-layout'>
					<div className='profile-form'>
						<div className='form-fields'>
							{/* Почта */}
							<div className='form-group'>
								<label className='form-label' htmlFor='email-input'>
									Почта
								</label>
								<div className={`input-wrapper ${themeClass}`}>
									<input
										id='email-input'
										type='email'
										value={formData.email}
										onChange={(e) => handleInputChange('email', e.target.value)}
										className={`form-input ${themeClass}`}
									/>
									<button
										className={`edit-button ${themeClass}`}
										aria-label='Редактировать email'
									>
										<img src={EditIcon} alt='Edit' className='w-4 h-4' />
									</button>
								</div>
								<a href='#' className='change-password-link'>
									Изменить пароль
								</a>
							</div>

							{/* Имя */}
							<div className='form-group'>
								<label className='form-label' htmlFor='name-input'>
									Имя
								</label>
								<div className={`input-wrapper ${themeClass}`}>
									<input
										id='name-input'
										type='text'
										value={formData.name}
										onChange={(e) => handleInputChange('name', e.target.value)}
										className={`form-input ${themeClass}`}
									/>
									<button
										className={`edit-button ${themeClass}`}
										aria-label='Редактировать имя'
									>
										<img src={EditIcon} alt='Edit' className='w-4 h-4' />
									</button>
								</div>
							</div>

							{/* Дата рождения и Пол */}
							<div className='form-row'>
								<div className='form-group'>
									<label className='form-label'>Дата рождения</label>
									<DatePicker
										selected={formData.birthDate}
										onChange={(date: Date | null) =>
											handleInputChange('birthDate', date || new Date())
										}
										placeholder='Выберите дату'
										maxDate={new Date()}
										className={`form-datepicker ${themeClass}`}
									/>
								</div>
								<div className='form-group'>
									<label className='form-label' htmlFor='gender-select'>
										Пол
									</label>
									<div className={`input-wrapper ${themeClass}`}>
										<select
											id='gender-select'
											value={formData.genderId}
											onChange={(e) =>
												handleInputChange('genderId', e.target.value)
											}
											className={`form-select ${themeClass}`}
										>
											{genders.map((gender) => (
												<option key={gender.id} value={gender.id}>
													{gender.label}
												</option>
											))}
										</select>
										<ChevronDownIcon className={`chevron-icon ${themeClass}`} />
									</div>
								</div>
							</div>

							{/* Город */}
							<div className='form-group'>
								<label className='form-label' htmlFor='city-select'>
									Город
								</label>
								<div className={`input-wrapper ${themeClass}`}>
									<select
										id='city-select'
										value={formData.locationId}
										onChange={(e) =>
											handleInputChange('locationId', e.target.value)
										}
										className={`form-select ${themeClass}`}
									>
										{cities.map((city) => (
											<option key={city.id} value={city.id}>
												{city['city-name']}
											</option>
										))}
									</select>
									<ChevronDownIcon className={`chevron-icon ${themeClass}`} />
								</div>
							</div>

							{/* О себе */}
							<div className='form-group'>
								<label className='form-label' htmlFor='about-textarea'>
									О себе
								</label>
								<div className={`input-wrapper ${themeClass}`}>
									<textarea
										id='about-textarea'
										value={formData.about}
										onChange={(e) => handleInputChange('about', e.target.value)}
										rows={4}
										className={`form-textarea ${themeClass}`}
									/>
									<button
										className={`edit-button-textarea ${themeClass}`}
										aria-label='Редактировать описание'
									>
										<img src={EditIcon} alt='Edit' className='w-4 h-4' />
									</button>
								</div>
							</div>

							{/* Кнопка сохранить */}
							<button
								onClick={handleSave}
								className={`save-button ${themeClass}`}
								aria-label='Сохранить изменения профиля'
							>
								Сохранить
							</button>
						</div>

						{/* Секция аватара */}
						<div className='avatar-section'>
							<div className='avatar-container'>
								<div className='avatar-wrapper'>
									<div className='avatar-image'>
										<img
											src={avatarPreview || avatarUrl}
											alt='User Avatar'
											className='w-full h-full'
											onError={(e) => {
												const target = e.currentTarget;
												target.onerror = null;
												target.src = DEFAULT_AVATAR;
											}}
										/>
									</div>
									<button
										className='avatar-edit-button'
										onClick={handleAvatarEditClick}
										aria-label='Изменить аватар'
									>
										<img src={EditIcon} alt='Edit' className='w-5 h-5' />
									</button>
									<input
										type='file'
										ref={fileInputRef}
										onChange={handleFileChange}
										accept='image/*'
										style={{ display: 'none' }}
										aria-hidden='true'
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
