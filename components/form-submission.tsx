"use client";

import React from "react";
import { PreviewPane } from "@/components/builder/preview-pane";
import type { Field } from "@/types/field";

interface FormSubmissionProps {
	formId: string;
	title: string;
	description: string;
	fields: Field[];
}

export function FormSubmission({
	formId,
	title,
	description,
	fields,
}: FormSubmissionProps) {
	return (
		<div className="min-h-screen bg-gray-50 py-12 px-4">
			<div className="max-w-2xl mx-auto">
				<PreviewPane
					formId={formId}
					fields={fields}
					title={title}
					description={description}
				/>
			</div>
		</div>
	);
}
