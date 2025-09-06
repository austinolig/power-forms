export type Field = {
	id: string;
	type: FieldType;
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

export const FIELD_TYPES = [
	"text",
	"number",
	"email",
	"textarea",
	"checkbox",
	"radio",
] as const;

export type FieldType = (typeof FIELD_TYPES)[number];

export const DEFAULT_FIELD_OPTIONS = {
	checkbox: ["Option 1", "Option 2", "Option 3"],
	radio: ["Option 1", "Option 2", "Option 3"],
} as const;

export const VIEW_TYPES = {
	EDITOR: "editor",
	PREVIEW: "preview",
	SPLIT: "split",
} as const;

export type ViewType = (typeof VIEW_TYPES)[keyof typeof VIEW_TYPES];
