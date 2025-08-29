"use client";

import React from "react";
import { FormHeader } from "./form-header";
import { EditorField } from "./editor-field";
import { AddFieldDropdown } from "./add-field-dropdown";
import { Field } from "./preview-field";

interface EditorPaneProps {
	fields: Field[];
	formTitle: string;
	formDescription: string;
	onTitleChange: (title: string) => void;
	onDescriptionChange: (description: string) => void;
	onAddField: (type: string, insertIndex?: number) => void;
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
		<div className="space-y-6">
			<FormHeader
				title={formTitle}
				description={formDescription}
				onTitleChange={onTitleChange}
				onDescriptionChange={onDescriptionChange}
			/>
			<div className="flex justify-center">
				<AddFieldDropdown
					onAddField={onAddField}
					insertIndex={fields.length > 0 ? -1 : 0}
				/>
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
