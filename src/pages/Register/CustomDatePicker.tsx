import { ru } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './datepicker-overrides.css';

interface CustomDatePickerProps {
	selectedDate: Date | null;
	tempDate: Date | null;
	setTempDate: (date: Date | null) => void;
	setFinalDate: (date: Date | null) => void;
	onClose: () => void;
}

const CustomDatePicker = ({
	tempDate,
	setTempDate,
	setFinalDate,
	onClose,
}: CustomDatePickerProps) => {
	const handleDateSelect = (date: Date | null) => setTempDate(date);
	const handleConfirmDate = () => {
		setFinalDate(tempDate);
		onClose();
	};

	const CustomCalendarContainer = ({ children }: any) => (
		<div className='custom-datepicker-container'>
			{children}
			<div className='datepicker-footer'>
				<button
					type='button'
					className='react-datepicker__custom-button cancel'
					onClick={onClose}
				>
					Отменить
				</button>
				<button
					type='button'
					className='react-datepicker__custom-button select'
					onClick={handleConfirmDate}
				>
					Выбрать
				</button>
			</div>
		</div>
	);

	return (
		<div className='datepicker-popup'>
			<DatePicker
				selected={tempDate}
				onChange={handleDateSelect}
				inline
				locale={ru}
				showMonthDropdown
				showYearDropdown
				dropdownMode='select'
				calendarContainer={CustomCalendarContainer}
			/>
		</div>
	);
};

export default CustomDatePicker;
