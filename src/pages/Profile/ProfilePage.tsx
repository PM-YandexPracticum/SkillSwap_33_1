import { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import './ProfilePage.css';
import EditIcon from '../../shared/assets/icons/edit.svg';
import EditPhotoIcon from '../../shared/assets/icons/edit.svg';
import ChevronDownIcon from '../../shared/assets/icons/chevron-down.svg?react';
import userData from '../../../public/db/user.json';
import citiesData from '../../../public/db/city.json';
import DatePicker from '@/components/DatePicker/DatePicker';
import type { CitiesResponse, User } from '@/types';

const cities = (citiesData as CitiesResponse).cities;

const ProfilePage = () => {
  const user = userData as User;

  const parseDate = (dateString: string): Date => {
    const [day, month, year] = dateString.split('.').map(Number);
    return new Date(year, month - 1, day);
  };

  const [formData, setFormData] = useState({
    email: user.email || '',
    name: user.name || '',
    birthDate: user.age ? parseDate(user.age) : new Date(),
    gender: user.gender || 'Не указан',
    city: user.location || '',
    about: user.description || '',
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
                 <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Дата рождения</label>
                  <DatePicker
                    selected={formData.birthDate}
                    onChange={(date: any) => handleInputChange('birthDate', date || new Date())}
                    placeholder="Выберите дату"
                    maxDate={new Date()}
                    className="form-datepicker"
                  />
                </div>


                <div className='form-group'>
                  <label className='form-label'>Пол</label>
                  <div className='input-wrapper'>
                    <select
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
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

              {/* Город */}
              <div className='form-group'>
                <label className='form-label'>Город</label>
                <div className='input-wrapper'>
                  <select
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className='form-select'
                  >
                    {cities.map((city) => (
                      <option key={city.id} value={city["city-name"]}>
                        {city["city-name"]}
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
                      src={user.avatarUrl?.trim() || 'https://www.sifalibitkilerim.com/images/comment.png'}
                      alt="User Avatar"
                      className="w-full h-full"
                    />
                  </div>
                  <button className='avatar-edit-button'>
                    <img src={EditPhotoIcon} alt='Edit' className='w-5 h-5' />
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