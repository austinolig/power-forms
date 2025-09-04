"use client";

import React from "react";
import { Field } from "../field-utils";

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
import { useForm, ControllerRenderProps } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface PreviewPaneProps {
	formId?: string;
	fields: Field[];
	title: string;
	description: string;
}

function generateSchema(fields: Field[]) {
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
						? z.email({ error: "This field is required" })
						: z.email().optional()
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

function generateDefaultValues(fields: Field[]) {
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

export function PreviewPane({
	formId,
	fields,
	title,
	description,
}: PreviewPaneProps) {
	const formDataSchema = generateSchema(fields);
	type FormData = z.infer<typeof formDataSchema>;

	const form = useForm<FormData>({
		resolver: zodResolver(formDataSchema),
		defaultValues: generateDefaultValues(fields),
	});

	function onSubmit(values: FormData) {
		console.log(values);
	}

	const renderField = (field: Field, formField: ControllerRenderProps) => {
		switch (field.type) {
			case "text":
			case "email":
			case "number":
				return (
					<Input
						{...formField}
						placeholder={field.settings?.placeholder || "Placeholder..."}
						value={formField.value || ""}
						type={field.type}
					/>
				);
			case "textarea":
				return (
					<Textarea
						{...formField}
						placeholder={field.settings?.placeholder || "Placeholder..."}
						rows={field.settings?.rows || 3}
						value={formField.value || ""}
					/>
				);
			case "checkbox":
				return (
					<div className="space-y-3">
						{field.options?.map((option) => (
							<FormItem key={option} className="flex items-center gap-3">
								<FormControl>
									<Checkbox
										checked={formField.value?.includes(option) || false}
										onCheckedChange={(checked) => {
											const currentValue = formField.value || [];
											return checked
												? formField.onChange([...currentValue, option])
												: formField.onChange(
														currentValue.filter(
															(value: string) => value !== option
														)
													);
										}}
									/>
								</FormControl>
								<FormLabel>{option}</FormLabel>
							</FormItem>
						))}
					</div>
				);
			case "radio":
				return (
					<RadioGroup
						onValueChange={formField.onChange}
						value={formField.value || ""}
						className="flex flex-col"
					>
						{field.options?.map((option) => (
							<FormItem key={option} className="flex items-center gap-3">
								<FormControl>
									<RadioGroupItem value={option} />
								</FormControl>
								<FormLabel>{option}</FormLabel>
							</FormItem>
						))}
					</RadioGroup>
				);
			default:
				return <div>Preview: Unhandled field type: {field.type}</div>;
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
						<Button type="submit">Submit</Button>
					</form>
				</Form>
			)}
		</div>
	);
}
