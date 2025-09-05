import * as z from "zod";
import { Field } from "@/types/field";

export function generateSchema(fields: Field[]) {
	const schema: Record<string, z.ZodType> = {};

	fields.forEach((field) => {
		switch (field.type) {
			case "text":
			case "textarea":
			case "radio":
				const stringSchema = z.preprocess(
					(value) => {
						if (value === "") return undefined;
						return value;
					},
					field.required
						? z.string({ error: "This field is required" })
						: z.string().optional()
				);
				schema[field.id] = stringSchema;
				break;
			case "email":
				const emailSchema = z.preprocess(
					(value) => {
						if (value === "") return undefined;
						return value;
					},
					field.required
						? z.string({ error: "This field is required" }).email()
						: z.string().email().optional()
				);
				schema[field.id] = emailSchema;
				break;
			case "number":
				const numberSchema = z.preprocess(
					(value) => {
						if (value === "") return undefined;
						return value;
					},
					field.required
						? z.coerce.number({ error: "This field is required" })
						: z.coerce.number().optional()
				);
				schema[field.id] = numberSchema;
				break;
			case "checkbox":
				const checkboxSchema = z.preprocess(
					(value: string[]) => {
						if (value.length === 0) return undefined;
						return value;
					},
					field.required
						? z.array(z.string(), {
								error: "Please select at least one option",
							})
						: z.array(z.string()).optional()
				);
				schema[field.id] = checkboxSchema;
				break;
			default:
				console.warn(`generateSchema: Unhandled field type: ${field.type}`);
				break;
		}
	});

	return z.object(schema);
}

export function generateDefaultValues(fields: Field[]) {
	const defaultValues: Record<string, string | string[] | number> = {};

	fields.forEach((field) => {
		switch (field.type) {
			case "text":
			case "email":
			case "number":
			case "textarea":
			case "radio":
				defaultValues[field.id] = "";
				break;
			case "checkbox":
				defaultValues[field.id] = [];
				break;
			default:
				console.warn(
					`generateDefaultValues: Unhandled field type: ${field.type}`
				);
				break;
		}
	});

	return defaultValues;
}
