import { ModalUI } from '../../shared/ui/modal/modal';
import type { TModalProps } from './type';
import { useCallback, useEffect } from 'react';

export const Modal = ({
	isOpen,
	onClose,
	title,
	message,
	icon,
}: TModalProps) => {
	const handleEscapeClose = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose();
			}
		},
		[onClose]
	);

	useEffect(() => {
		if (!isOpen) return;
		document.addEventListener('keydown', handleEscapeClose);
		return () => {
			document.removeEventListener('keydown', handleEscapeClose);
		};
	}, [isOpen, handleEscapeClose]);

	return (
		<ModalUI
			isOpen={isOpen}
			onClose={onClose}
			title={title}
			message={message}
			icon={icon}
		/>
	);
};
