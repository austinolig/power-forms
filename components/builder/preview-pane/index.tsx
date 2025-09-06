"use client";

import React from "react";
import { Field } from "@/types/field";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateSchema, generateDefaultValues } from "@/lib/validation";
import { renderField } from "./field-inputs";
import { createSubmissionAction } from "@/lib/actions/submission";
import { SubmissionData } from "@/types/db";

interface PreviewPaneProps {
	formId?: string;
	fields: Field[];
	title: string;
	description: string;
	responseMode?: boolean;
}

export function PreviewPane({
	formId,
	fields,
	title,
	description,
	responseMode = false,
}: PreviewPaneProps) {
	const formDataSchema = generateSchema(fields);
	type FormData = z.infer<typeof formDataSchema>;

	const form = useForm<FormData>({
		resolver: zodResolver(formDataSchema),
		defaultValues: generateDefaultValues(fields),
	});

	async function onSubmit(values: FormData) {
		console.log("Client-side validation successful.");
		const result = await createSubmissionAction(
			formId!,
			values as SubmissionData,
			fields
		);

		if (result.success) {
			alert("Form submitted successfully!");
			form.reset();
		} else {
			alert("Submission failed.");
			console.error(result.error);
		}
	}

	return (
		<div className="max-w-2xl mx-auto space-y-6">
			{!responseMode && <h2 className="text-lg font-semibold">Preview</h2>}
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
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						{fields.map((_field: Field) => (
							<FormField
								key={_field.id}
								name={_field.id}
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											{_field.label}
											{_field.required && "*"}
										</FormLabel>
										<FormControl>{renderField(_field, field)}</FormControl>
										{_field.description && (
											<FormDescription>{_field.description}</FormDescription>
										)}
										<FormMessage />
									</FormItem>
								)}
							/>
						))}
						<Button disabled={!responseMode} type="submit">
							Submit
						</Button>
					</form>
				</Form>
			)}
		</div>
	);
}
