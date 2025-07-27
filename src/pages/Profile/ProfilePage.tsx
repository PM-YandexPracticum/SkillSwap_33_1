import { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import './ProfilePage.css';
import EditIcon from '../../shared/assets/icons/edit.svg';
import ChevronDownIcon from '../../shared/assets/icons/chevron-down.svg?react';
import citiesData from '../../../public/db/city.json';
import genderData from '../../../public/db/gender.json';
import DatePicker from '@/components/DatePicker/DatePicker';
import type { CitiesResponse } from '@/types';
import { useUser } from '@/shared/hooks/useUser';

const cities = (citiesData as CitiesResponse).cities;
const genders = genderData.genders;

const ProfilePage = () => {
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
		console.log('Сохранение данных:', formData);
	};

	return (
		<div className='profile-container'>
			<div className='profile-content'>
				<div className='profile-layout'>
					<div className='profile-form'>
						<div className='form-fields'>
							{/* Почта */}
							<div className='form-group'>
								<label className='form-label'>Почта</label>
								<div className='input-wrapper'>
									<input
										type='email'
										value={formData.email}
										onChange={(e) => handleInputChange('email', e.target.value)}
										className='form-input'
									/>
									<button className='edit-button'>
										<img src={EditIcon} alt='Edit' className='w-4 h-4' />
									</button>
								</div>
								<a href='#' className='change-password-link'>
									Изменить пароль
								</a>
							</div>

							{/* Имя */}
							<div className='form-group'>
								<label className='form-label'>Имя</label>
								<div className='input-wrapper'>
									<input
										type='text'
										value={formData.name}
										onChange={(e) => handleInputChange('name', e.target.value)}
										className='form-input'
									/>
									<button className='edit-button'>
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
										className='form-datepicker'
									/>
								</div>

								<div className='form-group'>
									<label className='form-label'>Пол</label>
									<div className='input-wrapper'>
										<select
											value={formData.genderId}
											onChange={(e) =>
												handleInputChange('genderId', e.target.value)
											}
											className='form-select'
										>
											{genders.map((gender) => (
												<option key={gender.id} value={gender.id}>
													{gender.label}
												</option>
											))}
										</select>
										<ChevronDownIcon className='chevron-icon' />
									</div>
								</div>
							</div>

							{/* Город */}
							<div className='form-group'>
								<label className='form-label'>Город</label>
								<div className='input-wrapper'>
									<select
										value={formData.locationId}
										onChange={(e) =>
											handleInputChange('locationId', e.target.value)
										}
										className='form-select'
									>
										{cities.map((city) => (
											<option key={city.id} value={city.id}>
												{city['city-name']}
											</option>
										))}
									</select>
									<ChevronDownIcon className='chevron-icon' />
								</div>
							</div>

							{/* О себе */}
							<div className='form-group'>
								<label className='form-label'>О себе</label>
								<div className='input-wrapper'>
									<textarea
										value={formData.about}
										onChange={(e) => handleInputChange('about', e.target.value)}
										rows={4}
										className='form-textarea'
									/>
									<button className='edit-button-textarea'>
										<img src={EditIcon} alt='Edit' className='w-4 h-4' />
									</button>
								</div>
							</div>

							{/* Кнопка сохранить */}
							<button onClick={handleSave} className='save-button'>
								Сохранить
							</button>
						</div>

						{/* Секция аватара */}
						<div className='avatar-section'>
							<div className='avatar-container'>
								<div className='avatar-wrapper'>
									<div className='avatar-image'>
										<img
											src={avatarUrl}
											alt='User Avatar'
											className='w-full h-full'
										/>
									</div>
									<button className='avatar-edit-button'>
										<img src={EditIcon} alt='Edit' className='w-5 h-5' />
									</button>
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
