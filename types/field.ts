export type Field = {
	id: string;
	type: string;
	label: string;
	description?: string;
	options?: string[];
	required?: boolean;
	settings?: FieldSettings;
};

export type FieldSettings = {
	placeholder?: string;
	minLength?: number;
	maxLength?: number;
	min?: number;
	max?: number;
	step?: number;
	rows?: number;
	pattern?: string;
	allowedDomains?: string[];
	minSelections?: number;
	maxSelections?: number;
};
