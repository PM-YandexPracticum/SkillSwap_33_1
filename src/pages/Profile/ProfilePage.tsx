import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './ProfilePage.css';
import EditIcon from '../../shared/assets/icons/edit.svg';
import EditPhotoIcon from '../../shared/assets/icons/edit.svg';
import ChevronDownIcon from '../../shared/assets/icons/chevron-down.svg?react';

const ProfilePage = () => {
	const [formData, setFormData] = useState({
		email: 'Mariia@gmail.com',
		name: 'Мария',
		birthDate: new Date('1995-10-28'),
		gender: 'Женский',
		city: 'Москва',
		about:
			'Люблю учиться новому, особенно если это можно делать за чаем и в пижаме. Всегда готова пообщаться и обменяться чем-то интересным!',
	});

	const handleInputChange = (field: string, value: string | Date) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSave = () => {
		console.log('Сохранение данных:', formData);
		// Здесь будет логика сохранения
	};

	return (
		<div className='profile-container'>
			<div className='profile-content'>
				<div className='profile-layout'>
					<div className='profile-form'>
						<div className='form-fields'>
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

							<div className='form-row'>
								<div className='form-group'>
									<label className='form-label'>Дата рождения</label>
									<div className='datepicker-wrapper'>
										<DatePicker
											selected={formData.birthDate}
											onChange={(date) =>
												handleInputChange('birthDate', date || new Date())
											}
											dateFormat='dd.MM.yyyy'
											placeholderText='Выберите дату'
											className='form-input'
											showYearDropdown
											showMonthDropdown
											dropdownMode='select'
											maxDate={new Date()}
										/>
									</div>
								</div>

								<div className='form-group'>
									<label className='form-label'>Пол</label>
									<div className='input-wrapper'>
										<select
											value={formData.gender}
											onChange={(e) =>
												handleInputChange('gender', e.target.value)
											}
											className='form-select'
										>
											<option value='Женский'>Женский</option>
											<option value='Мужской'>Мужской</option>
											<option value='Не указан'>Не указан</option>
										</select>
										<ChevronDownIcon className='chevron-icon' />
									</div>
								</div>
							</div>

							<div className='form-group'>
								<label className='form-label'>Город</label>
								<div className='input-wrapper'>
									<select
										value={formData.city}
										onChange={(e) => handleInputChange('city', e.target.value)}
										className='form-select'
									>
										<option value='Москва'>Москва</option>
										<option value='Санкт-Петербург'>Санкт-Петербург</option>
										<option value='Казань'>Казань</option>
										<option value='Новосибирск'>Новосибирск</option>
									</select>
									<ChevronDownIcon className='chevron-icon' />
								</div>
							</div>

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

							<button onClick={handleSave} className='save-button'>
								Сохранить
							</button>
						</div>

						<div className='avatar-section'>
							<div className='avatar-container'>
								<div className='avatar-wrapper'>
									<div className='avatar-image'>
										<img
											src='https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'
											alt='User Avatar'
										/>
									</div>
									<button className='avatar-edit-button'>
										<img src={EditPhotoIcon} alt='Edit' className='w-56 h-56' />
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
