"use client";

import React from "react";
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
	const handleSubmit = async (formData: FormData) => {
		if (!formId) return;

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
				<form className="space-y-6" action={handleSubmit}>
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
