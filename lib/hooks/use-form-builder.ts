"use client";

import { useState, useEffect } from "react";
import { Field } from "@/types/field";
import { getDefaultLabel } from "@/components/builder/editor-pane/field-helpers";
import { DEFAULT_FIELD_OPTIONS } from "@/types/field";

interface UseFormBuilderProps {
	initialTitle?: string;
	initialDescription?: string;
	initialFields?: Field[];
}

export function useFormBuilder({
	initialTitle = "Untitled Form",
	initialDescription = "",
	initialFields = [],
}: UseFormBuilderProps = {}) {
	const [formTitle, setFormTitle] = useState<string>(initialTitle);
	const [formDescription, setFormDescription] =
		useState<string>(initialDescription);
	const [fields, setFields] = useState<Field[]>(initialFields);

	useEffect(() => {
		if (initialTitle !== "Untitled Form") {
			setFormTitle(initialTitle);
		}
		if (initialDescription) {
			setFormDescription(initialDescription);
		}
		if (initialFields.length > 0) {
			setFields(initialFields);
		}
	}, [initialTitle, initialDescription, initialFields]);

	const handleAddField = (type: string, insertIndex?: number) => {
		const newField: Field = {
			id: crypto.randomUUID(),
			type: type,
			label: getDefaultLabel(type),
			required: false,
			...(type === "checkbox" || type === "radio"
				? {
						options: [
							...DEFAULT_FIELD_OPTIONS[
								type as keyof typeof DEFAULT_FIELD_OPTIONS
							],
						],
					}
				: {}),
		};

		if (insertIndex !== undefined) {
			setFields((prevFields) => {
				const newFields = [...prevFields];
				newFields.splice(insertIndex + 1, 0, newField);
				return newFields;
			});
		} else {
			setFields((prevFields) => [...prevFields, newField]);
		}
	};

	const handleUpdateField = (updatedField: Field) => {
		setFields((prevFields) =>
			prevFields.map((field) =>
				field.id === updatedField.id ? updatedField : field
			)
		);
	};

	const handleRemoveField = (id: string) => {
		setFields((prevFields) => prevFields.filter((field) => field.id !== id));
	};

	return {
		formTitle,
		formDescription,
		fields,
		setFormTitle,
		setFormDescription,
		handleAddField,
		handleUpdateField,
		handleRemoveField,
	};
}
