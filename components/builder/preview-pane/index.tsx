"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { PreviewField } from "./preview-field";
import { Field } from "../field-utils";
import { createSubmissionAction } from "@/lib/actions";
import { formDataToJson } from "@/lib/utils";

interface PreviewPaneProps {
	formId?: string;
	fields: Field[];
	title: string;
	description: string;
}

export function PreviewPane({
	formId,
	fields,
	title,
	description,
}: PreviewPaneProps) {
	const formRef = useRef<HTMLFormElement>(null);

	const validateForm = () => {
		const form = formRef.current;
		if (!form) return true;

		// Check for validation errors in all fields (checkboxes, emails, etc.)
		const errorElements = form.querySelectorAll(".text-red-500");
		if (errorElements.length > 0) {
			alert("Please fix the validation errors before submitting.");
			return false;
		}

		return true;
	};

	const handleSubmit = async (formData: FormData) => {
		if (!formId) return;

		if (!validateForm()) return;

		const data = formDataToJson(formData);
		const result = await createSubmissionAction(formId, data);

		if (result.success) {
			alert("Form submitted successfully!");
		} else {
			alert("Failed to submit form.");
		}
	};

	return (
		<div className="max-w-2xl mx-auto space-y-6">
			{!formId && <h2 className="text-lg font-semibold">Preview</h2>}
			<p className="text-2xl font-bold">{title}</p>
			{description && (
				<p className="text-muted-foreground mt-2">{description}</p>
			)}
			{fields.length === 0 ? (
				<div className="text-center space-y-4 py-6">
					<p className="text-muted-foreground">No fields to display.</p>
					{!formId && (
						<p className="text-sm text-muted-foreground">
							Add fields in the editor pane to see a preview here.
						</p>
					)}
				</div>
			) : (
				<form
					ref={formRef}
					className="space-y-6"
					action={handleSubmit}
					onSubmit={(e) => {
						if (!validateForm()) {
							e.preventDefault();
						}
					}}
				>
					{fields.map((field) => (
						<PreviewField key={field.id} field={field} />
					))}
					<Button type="submit" className="w-full" disabled={!formId}>
						Submit
					</Button>
				</form>
			)}
		</div>
	);
}
