import React, { useState, useRef, useEffect } from 'react';
import CalendarIcon from '../../shared/assets/icons/calendar.svg?react';
import './DatePicker.css';
import type { DatePickerProps } from '@/types';

const DatePicker: React.FC<DatePickerProps> = ({
	selected,
	onChange,
	placeholder = 'Выберите дату',
	maxDate,
	className = '',
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [viewDate, setViewDate] = useState(selected || new Date());
	const [tempSelected, setTempSelected] = useState<Date | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const months = [
		'Январь',
		'Февраль',
		'Март',
		'Апрель',
		'Май',
		'Июнь',
		'Июль',
		'Август',
		'Сентябрь',
		'Октябрь',
		'Ноябрь',
		'Декабрь',
	];

	const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const openCalendar = () => {
		setTempSelected(selected);
		setIsOpen(true);
	};

	const formatDate = (date: Date) => {
		return date.toLocaleDateString('ru-RU', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		});
	};

	const getDaysInMonth = (date: Date) => {
		const year = date.getFullYear();
		const month = date.getMonth();
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const daysInMonth = lastDay.getDate();
		let firstWeekDay = firstDay.getDay() - 1;
		if (firstWeekDay === -1) firstWeekDay = 6;

		const days = [];

		// Дни предыдущего месяца
		const prevMonthLastDay = new Date(year, month, 0).getDate();
		for (let i = firstWeekDay - 1; i >= 0; i--) {
			days.push({
				date: prevMonthLastDay - i,
				isCurrentMonth: false,
				isNextMonth: false,
			});
		}

		// Дни текущего месяца
		for (let day = 1; day <= daysInMonth; day++) {
			days.push({
				date: day,
				isCurrentMonth: true,
				isNextMonth: false,
			});
		}

		// Дни следующего месяца
		const remainingDays = 42 - days.length;
		for (let day = 1; day <= remainingDays; day++) {
			days.push({
				date: day,
				isCurrentMonth: false,
				isNextMonth: true,
			});
		}

		return days;
	};

	const handleDateClick = (
		day: number,
		isCurrentMonth: boolean,
		isNextMonth: boolean
	) => {
		let newDate: Date;
		if (!isCurrentMonth && !isNextMonth) {
			newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, day);
		} else if (isNextMonth) {
			newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, day);
		} else {
			newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
		}
		if (maxDate && newDate > maxDate) return;
		onChange(newDate);
	};

	const handleMonthChange = (monthIndex: number) => {
		setViewDate((prev) => {
			const newDate = new Date(prev);
			newDate.setMonth(monthIndex);
			return newDate;
		});
	};

	const handleYearChange = (year: number) => {
		setViewDate((prev) => {
			const newDate = new Date(prev);
			newDate.setFullYear(year);
			return newDate;
		});
	};

	const handleCancel = () => {
		if (tempSelected !== selected) {
			onChange(tempSelected);
		}
		setIsOpen(false);
	};

	const handleSelect = () => {
		setIsOpen(false);
	};

	const isDateSelected = (
		day: number,
		isCurrentMonth: boolean,
		isNextMonth: boolean
	) => {
		if (!selected) return false;
		let checkDate: Date;
		if (!isCurrentMonth && !isNextMonth) {
			checkDate = new Date(
				viewDate.getFullYear(),
				viewDate.getMonth() - 1,
				day
			);
		} else if (isNextMonth) {
			checkDate = new Date(
				viewDate.getFullYear(),
				viewDate.getMonth() + 1,
				day
			);
		} else {
			checkDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
		}
		return checkDate.toDateString() === selected.toDateString();
	};

	const days = getDaysInMonth(viewDate);

	return (
		<div className={`datepicker ${className}`} ref={containerRef}>
			<div className='datepicker__input' onClick={openCalendar}>
				<span
					className={selected ? 'datepicker__value' : 'datepicker__placeholder'}
				>
					{selected ? formatDate(selected) : placeholder}
				</span>
				<div className='datepicker__icon'>
					<CalendarIcon />
				</div>
			</div>

			{isOpen && (
				<div className='datepicker__dropdown'>
					<div className='datepicker__header'>
						<div className='datepicker__month-year'>
							<select
								value={viewDate.getMonth()}
								onChange={(e) =>
									handleMonthChange(parseInt(e.target.value, 10))
								}
								className='datepicker__select'
							>
								{months.map((month, index) => (
									<option key={index} value={index}>
										{month}
									</option>
								))}
							</select>
							<select
								value={viewDate.getFullYear()}
								onChange={(e) => handleYearChange(parseInt(e.target.value, 10))}
								className='datepicker__select'
							>
								{Array.from({ length: 100 }, (_, i) => {
									const year = new Date().getFullYear() - i;
									return (
										<option key={year} value={year}>
											{year}
										</option>
									);
								})}
							</select>
						</div>
					</div>

					<div className='datepicker__calendar'>
						<div className='datepicker__weekdays'>
							{weekDays.map((day) => (
								<div key={day} className='datepicker__weekday'>
									{day}
								</div>
							))}
						</div>
						<div className='datepicker__days'>
							{days.map((day, index) => (
								<button
									key={index}
									type='button'
									onClick={() =>
										handleDateClick(
											day.date,
											day.isCurrentMonth,
											day.isNextMonth
										)
									}
									className={`datepicker__day ${
										!day.isCurrentMonth ? 'datepicker__day--other-month' : ''
									} ${isDateSelected(day.date, day.isCurrentMonth, day.isNextMonth) ? 'datepicker__day--selected' : ''}`}
									disabled={
										maxDate &&
										new Date(
											day.isNextMonth
												? viewDate.getFullYear()
												: !day.isCurrentMonth
													? viewDate.getFullYear()
													: viewDate.getFullYear(),
											day.isNextMonth
												? viewDate.getMonth() + 1
												: !day.isCurrentMonth
													? viewDate.getMonth() - 1
													: viewDate.getMonth(),
											day.date
										) > maxDate
									}
								>
									{day.date}
								</button>
							))}
						</div>
					</div>

					<div className='datepicker__actions'>
						<button
							type='button'
							onClick={handleCancel}
							className='datepicker__button datepicker__button--cancel'
						>
							Отменить
						</button>
						<button
							type='button'
							onClick={handleSelect}
							className='datepicker__button datepicker__button--select'
						>
							Выбрать
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default DatePicker;
