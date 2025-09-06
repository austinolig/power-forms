"use client";

import React from "react";
import { EditorField } from "./editor-field";
import { AddFieldDropdown } from "./add-field-dropdown";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldType } from "@/types/field";

interface EditorPaneProps {
	fields: Field[];
	formTitle: string;
	formDescription: string;
	onTitleChange: (title: string) => void;
	onDescriptionChange: (description: string) => void;
	onAddField: (type: FieldType, insertIndex?: number) => void;
	onUpdateField: (updatedField: Field) => void;
	onDeleteField: (id: string) => void;
}

export function EditorPane({
	fields,
	formTitle,
	formDescription,
	onTitleChange,
	onDescriptionChange,
	onAddField,
	onUpdateField,
	onDeleteField,
}: EditorPaneProps) {
	return (
		<div className="max-w-2xl mx-auto space-y-6">
			<h2 className="text-lg font-semibold">Editor</h2>
			<div className="space-y-2">
				<Label className="text-sm">Form Title</Label>
				<Input
					value={formTitle}
					onChange={(e) => onTitleChange(e.target.value)}
					placeholder="Enter form title..."
				/>
			</div>
			<div className="space-y-2">
				<Label className="text-sm">Form Description (Optional)</Label>
				<Textarea
					value={formDescription}
					onChange={(e) => onDescriptionChange(e.target.value)}
					placeholder="Enter form description..."
					rows={3}
				/>
			</div>
			<div className="flex justify-center">
				<AddFieldDropdown onAddField={onAddField} insertIndex={-1} />
			</div>
			{fields.map((field, index) => (
				<React.Fragment key={field.id}>
					<div className="border p-6 rounded-lg bg-card">
						<EditorField
							field={field}
							onUpdate={onUpdateField}
							onDelete={onDeleteField}
						/>
					</div>
					<div className="flex justify-center">
						<AddFieldDropdown onAddField={onAddField} insertIndex={index} />
					</div>
				</React.Fragment>
			))}
		</div>
	);
}
