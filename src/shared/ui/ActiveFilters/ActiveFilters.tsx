import type { ActiveFilterProps } from './types';
import styles from './ActiveFilters.module.css';
import CrossIcon from '../../assets/icons/cross.svg?react';
import { Button } from '../button/button';

export const ActiveFilters = ({ filters, onRemoveTag }: ActiveFilterProps) => {
	if (filters.length === 0) {
		return null;
	}

	return (
		<div className={styles.container}>
			{filters.map((filter) => (
				<Button
					key={filter.id}
					onClick={() => onRemoveTag(filter)}
					type='button'
					variant='tertiary'
				>
					{filter.label}
					<CrossIcon className={styles.icon} />
				</Button>
			))}
		</div>
	);
};
