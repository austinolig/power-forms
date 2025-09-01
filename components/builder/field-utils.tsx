import { AlignLeft, CheckSquare, Circle, Hash, Mail, Type } from "lucide-react";

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

export const getFieldIcon = (type: string) => {
	switch (type) {
		case "text":
			return <Type className="h-4 w-4" />;
		case "number":
			return <Hash className="h-4 w-4" />;
		case "email":
			return <Mail className="h-4 w-4" />;
		case "textarea":
			return <AlignLeft className="h-4 w-4" />;
		case "checkbox":
			return <CheckSquare className="h-4 w-4" />;
		case "radio":
			return <Circle className="h-4 w-4" />;
		default:
			return <Type className="h-4 w-4" />;
	}
};

export const getFieldTypeName = (type: string) => {
	switch (type) {
		case "text":
			return "Text Input";
		case "number":
			return "Number Input";
		case "email":
			return "Email Input";
		case "textarea":
			return "Textarea";
		case "checkbox":
			return "Checkbox Group";
		case "radio":
			return "Radio Group";
		default:
			return type;
	}
};

export const getDefaultLabel = (type: string) => {
	switch (type) {
		case "email":
			return "Email Address";
		case "number":
			return "Number";
		case "textarea":
			return "Message";
		default:
			return type.charAt(0).toUpperCase() + type.slice(1);
	}
};
