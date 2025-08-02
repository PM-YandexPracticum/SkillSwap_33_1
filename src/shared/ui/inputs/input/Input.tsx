import type { IInputProps } from './Input.props';
import clsx from 'clsx';
import styles from './Input.module.css';
import EditIcon from '@shared/assets/icons/edit.svg?react';
import EyeIcon from '@shared/assets/icons/eye.svg?react';
import { useState } from 'react';

// Универсальный инпут (Input) для форм
const Input = ({
	labelTitle,
	placeholder,
	inputError,
	showTooltipIcon = true,
	tooltipIcon,
	type: typeProp = 'text',
	className,
	...props
}: IInputProps) => {
	const [isTextShown, setIsTextShown] = useState(
		typeProp === 'password' ? false : true
	);

	return (
		<label className={clsx(styles.label)}>
			{labelTitle && labelTitle}
			<div className={styles.inputWrapper}>
				<input
					className={clsx(
						styles.input,
						{
							[styles.inputNoTooltipIcons]: !showTooltipIcon,
							[styles.error]: inputError && inputError.errorType === 'error',
							[styles.warning]:
								inputError && inputError.errorType === 'warning',
						},
						className
					)}
					type={
						typeProp !== 'password'
							? typeProp
							: isTextShown
								? 'text'
								: 'password'
					}
					placeholder={placeholder ?? ''}
					{...props}
				/>
				<span className={styles.inputIconWrapper}>
					{typeProp === 'text' &&
						showTooltipIcon &&
						(tooltipIcon ? (
							tooltipIcon
						) : (
							<EditIcon className={styles.inputIcon} aria-hidden />
						))}
					{typeProp === 'password' && (
						<button
							type='button'
							className={styles.buttonIcon}
							onClick={() => setIsTextShown((prev) => !prev)}
							aria-label={isTextShown ? 'Спрятать пароль' : 'Показать пароль'}
						>
							<EyeIcon className={styles.inputIcon} />
						</button>
					)}
				</span>
			</div>
			{inputError && inputError.message?.trim() && (
				<span
					className={clsx(styles.message, {
						[styles.messageError]:
							inputError && inputError.errorType === 'error',
						[styles.messageWarning]:
							inputError && inputError.errorType === 'warning',
					})}
				>
					{inputError.message}
				</span>
			)}
		</label>
	);
};

export default Input;
