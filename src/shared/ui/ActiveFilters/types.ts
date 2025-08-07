export type ActiveFilterButton = {
	id: string;
	type: 'type' | 'gender' | 'skill' | 'skillCategory' | 'city' | 'favorites';
	label: string;
};

export type ActiveFilterProps = {
	filters: ActiveFilterButton[];
	onRemoveTag: (filter: ActiveFilterButton) => void;
};
