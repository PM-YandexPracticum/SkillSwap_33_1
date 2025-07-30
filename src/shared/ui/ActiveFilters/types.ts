export type ActiveFilterButton = {
	id: string;
	type: 'type' | 'gender' | 'skill' | 'skillCategory' | 'city';
	label: string;
};

export type ActiveFilterProps = {
	filters: ActiveFilterButton[];
	onRemoveTag: (filter: ActiveFilterButton) => void;
};
