import React, { useState } from 'react';
import type { OptionProps, ValueContainerProps, GroupBase } from 'react-select';
import Select, { components } from 'react-select';
import styles from './InputSelect.module.css';
import type {
	IInputSelectOptionType,
	IInputSelectProps,
} from './InputSelect.props';
import clsx from 'clsx';
import CheckboxIcon from '@shared/assets/icons/checkbox-empty.svg?react';
import CheckboxCheckedIcon from '@shared/assets/icons/checkbox-done.svg?react';

const textBodyStyles = {
	color: 'var(--color-text)',
	fontFamily: 'roboto, sans-serif',
	fontSize: '16px',
	letterSpacing: '0.3px',
	lineHeight: '1.5',
	fontWeight: '400',
	fontStyle: 'normal',
} as const;

const CheckboxOption: React.FC<
	OptionProps<
		IInputSelectOptionType,
		boolean,
		GroupBase<IInputSelectOptionType>
	>
> = ({ innerProps, label, isSelected, isFocused }) => {
	return (
		<div
			{...innerProps}
			className={clsx(styles.option, {
				[styles.checkboxFocused]: isFocused,
			})}
			style={{
				display: 'flex',
				alignItems: 'center',
				cursor: 'pointer',
				padding: '4px 12px',
				gap: '8px',
				backgroundColor: isFocused ? '#e4e8df' : 'transparent',
				color: 'var(--color-text)',
			}}
		>
			<span
				className={styles.checkboxWrapper}
				aria-label={isSelected ? 'выбрано' : 'не выбрано'}
			>
				{isSelected ? (
					<CheckboxCheckedIcon width={20} height={20} />
				) : (
					<CheckboxIcon width={20} height={20} />
				)}
			</span>

			<span>{label}</span>
		</div>
	);
};

const ValueContainer: React.FC<
	ValueContainerProps<
		IInputSelectOptionType,
		boolean,
		GroupBase<IInputSelectOptionType>
	>
> = ({ children, selectProps, getValue, ...props }) => {
	const customSelectProps = selectProps as IInputSelectProps;

	const handleClick = (e: React.MouseEvent) => {
		e.preventDefault(); // Предотвращаем всплытие, если нужно
		e.stopPropagation();

		if (selectProps.menuIsOpen) {
			selectProps.onMenuClose();
		} else {
			selectProps.onMenuOpen();
		}
	};

	if (customSelectProps.isMulti) {
		const selected = getValue();
		const count = Array.isArray(selected) ? selected.length : 0;

		return (
			<components.ValueContainer
				{...props}
				selectProps={selectProps}
				getValue={getValue}
			>
				<div className={clsx(styles.valueContainer)} onClick={handleClick}>
					{count > 0 ? (
						<span className={styles.option}>{`Выбрано: ${count}`}</span>
					) : selectProps.placeholder ? (
						<span className={styles.placeholder}>
							{selectProps.placeholder}
						</span>
					) : (
						<span className={styles.placeholder}>Выберите...</span>
					)}
				</div>
			</components.ValueContainer>
		);
	}

	return (
		<components.ValueContainer
			{...props}
			selectProps={selectProps}
			getValue={getValue}
		>
			{children}
		</components.ValueContainer>
	);
};

const InputSelect: React.FC<IInputSelectProps> = ({
	selectTitle,
	options,
	selectType = 'list',
	isSearchable = true,
	menuIsOpen,
	isMulti: propIsMulti = false,
	...props
}) => {
	const [isOpen, setIsOpen] = useState(menuIsOpen);

	const isMultiMode = propIsMulti || selectType === 'checkboxes';
	const shouldShowSearch = selectType !== 'checkboxes' && isSearchable;

	return (
		<label className={styles.label}>
			{selectTitle && <span className={styles.selectTitle}>{selectTitle}</span>}
			<Select<
				IInputSelectOptionType,
				boolean,
				GroupBase<IInputSelectOptionType>
			>
				noOptionsMessage={() => 'Ничего не найдено'}
				isMulti={isMultiMode}
				isSearchable={shouldShowSearch}
				onMenuOpen={() => setIsOpen(true)}
				menuIsOpen={isOpen}
				onMenuClose={() => setIsOpen(false)}
				classNamePrefix='react-select'
				closeMenuOnSelect={false}
				hideSelectedOptions={false}
				options={options}
				onBlur={() => setIsOpen(false)}
				{...props}
				components={{
					Option:
						selectType === 'checkboxes' ? CheckboxOption : components.Option,
					ValueContainer,
				}}
				styles={{
					indicatorSeparator: () => ({ display: 'none' }),
					indicatorsContainer: (provided) => ({
						...provided,
						transform: isOpen ? 'rotateX(180deg)' : 'rotateX(0deg)',
						transition: 'transform 0.2s ease',
					}),
					container: (base) => ({
						...base,
						borderRadius: '12px',
						border: '1px solid #69735d',
						overflow: 'hidden',
						backgroundColor: 'var(--color-surface)',
					}),
					menu: (base) => ({
						...base,
						borderRadius: '12px',
						margin: 0,
						position: 'relative',
						boxShadow: 'none',
						backgroundColor: 'var(--color-surface)',
					}),
					menuList: (base) => ({
						...base,
						padding: 0,
						marginTop: '8px',
						marginBottom: '8px',
					}),
					option: (provided, state) => ({
						...provided,
						...textBodyStyles,
						padding: '4px 20px',
						backgroundColor: state.isSelected ? '#E4E8DF' : 'transparent',
						display: 'flex',
						alignItems: 'center',
					}),
					control: (base, state) => ({
						...base,
						...textBodyStyles,
						borderRadius: '12px',
						border: 'none',
						padding: '4px 8px',
						boxShadow: state.menuIsOpen
							? '0 0 0 1px var(--color-border)'
							: 'none',
						backgroundColor: 'var(--color-surface)',
						cursor: 'pointer',
					}),
					multiValue: () => ({ display: 'none' }),
				}}
			/>
		</label>
	);
};

export default InputSelect;
