import { useState, useRef, useMemo } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import './ProfilePage.css';
import EditIcon from '../../shared/assets/icons/edit.svg';
import EyeIcon from '@/shared/assets/icons/eye.svg?react';
import EyeSlashIcon from '@/shared/assets/icons/eye-slash.svg?react';
import ChevronDownIcon from '../../shared/assets/icons/chevron-down.svg?react';
import citiesData from '../../../public/db/city.json';
import genderData from '../../../public/db/gender.json';
import DatePicker from '@/components/DatePicker/DatePicker';
import type { CitiesResponse } from '@/types';
import { DEFAULT_AVATAR, useUser, formatDate } from '@/shared/hooks/useUser';
import { useTheme } from '@/app/styles/ThemeProvider';
import {
	getStoredUsers,
	updateUser,
	type AuthUser,
} from '@/features/auth/AuthForm.model';
import { validatePassword } from '@/shared/lib/validation/auth.validation';

const cities = (citiesData as CitiesResponse).cities;
const genders = genderData.genders;

const ProfilePage = () => {
	const { theme } = useTheme();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const {
		id,
		email,
		name,
		birthDate,
		genderId,
		locationId,
		description,
		avatarUrl,
		password,
	} = useUser();

	const initialDataRef = useRef({
		email: email || '',
		name: name || '',
		birthDate: birthDate || null,
		genderId: genderId || 'unspecified',
		locationId: locationId || '',
		about: description || '',
		avatarUrl: avatarUrl || DEFAULT_AVATAR,
	});

	const [formData, setFormData] = useState({
		email: initialDataRef.current.email,
		name: initialDataRef.current.name,
		birthDate: initialDataRef.current.birthDate as Date | null,
		genderId: initialDataRef.current.genderId,
		locationId: initialDataRef.current.locationId,
		about: initialDataRef.current.about,
	});
	const [currentAvatar, setCurrentAvatar] = useState(
		initialDataRef.current.avatarUrl
	);
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isPasswordEditing, setIsPasswordEditing] = useState(false);
	const [newPassword, setNewPassword] = useState('');
	const [passwordError, setPasswordError] = useState<string | null>(null);

	const handleInputChange = (field: string, value: string | Date | null) => {
		if (field === 'email') setError(null);
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setNewPassword(value);
		setPasswordError(
			value
				? validatePassword(value)?.replace('знаков', 'символов') || null
				: null
		);
	};

	const isDirty = useMemo(() => {
		const initial = initialDataRef.current;
		return (
			formData.email !== initial.email ||
			formData.name !== initial.name ||
			formatDate(formData.birthDate) !==
				formatDate(initial.birthDate as Date | null) ||
			formData.genderId !== initial.genderId ||
			formData.locationId !== initial.locationId ||
			formData.about !== initial.about ||
			avatarPreview !== null ||
			newPassword !== ''
		);
	}, [formData, avatarPreview, newPassword]);

	const handleSave = () => {
		const users = getStoredUsers();
		if (
			formData.email !== initialDataRef.current.email &&
			users.some((u) => u.email === formData.email && u.id !== id)
		) {
			setError('Пользователь с таким email уже зарегистрирован');
			return;
		}

		if (passwordError) {
			return;
		}

		const updatedUser: AuthUser = {
			id,
			email: formData.email,
			password: newPassword || password,
			fullName: formData.name,
			birthDate: formatDate(formData.birthDate),
			gender: formData.genderId,
			genderId: formData.genderId,
			city: formData.locationId,
			locationId: formData.locationId,
			description: formData.about,
			avatarUrl: avatarPreview || currentAvatar,
		};

		updateUser(updatedUser);
		initialDataRef.current = {
			email: updatedUser.email,
			name: updatedUser.fullName || '',
			birthDate: formData.birthDate,
			genderId: updatedUser.genderId || 'unspecified',
			locationId: updatedUser.locationId || '',
			about: updatedUser.description || '',
			avatarUrl: updatedUser.avatarUrl || DEFAULT_AVATAR,
		};
		setCurrentAvatar(updatedUser.avatarUrl || DEFAULT_AVATAR);
		setAvatarPreview(null);
		setError(null);
		setIsPasswordEditing(false);
		setNewPassword('');
		setPasswordError(null);
		setFormData((prev) => ({ ...prev }));
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
	const [showNewPassword, setShowNewPassword] = useState(false);

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
								{error && <p className='error-message'>{error}</p>}
								{isPasswordEditing ? (
									<>
										<div className='form-group' style={{ marginTop: '24px' }}>
											<label
												className='form-label'
												htmlFor='new-password-input'
											>
												Новый пароль
											</label>
											<div className={`input-wrapper ${themeClass}`}>
												<input
													id='new-password-input'
													type={showNewPassword ? 'text' : 'password'}
													placeholder='Введите новый пароль'
													value={newPassword}
													onChange={handlePasswordChange}
													className={`form-input ${themeClass}`}
												/>
												<button
													type='button'
													onClick={() => setShowNewPassword(!showNewPassword)}
													className={`edit-button ${themeClass}`}
													aria-label={
														showNewPassword
															? 'Скрыть пароль'
															: 'Показать пароль'
													}
												>
													{showNewPassword ? (
														<EyeSlashIcon className='w-4 h-4' />
													) : (
														<EyeIcon className='w-4 h-4' />
													)}
												</button>
											</div>

											{passwordError && (
												<p className='error-message'>{passwordError}</p>
											)}
										</div>
									</>
								) : (
									<a
										href='#'
										className='change-password-link'
										onClick={(e) => {
											e.preventDefault();
											setIsPasswordEditing(true);
											setNewPassword('');
											setPasswordError(null);
										}}
									>
										Изменить пароль
									</a>
								)}
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
											handleInputChange('birthDate', date)
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
								disabled={!isDirty}
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
											src={avatarPreview || currentAvatar}
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
