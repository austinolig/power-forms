"use client";

import React, { useState } from "react";
import { Field } from "./preview-field";
import { EditorPane } from "./editor-pane";
import { PreviewPane } from "./preview-pane";
import { getDefaultLabel } from "./field-utils";

interface BuilderProps {
	currentView?: string;
}

export function Builder({ currentView = "split" }: BuilderProps) {
	const [fields, setFields] = useState<Field[]>([]);
	const [formTitle, setFormTitle] = useState<string>("Untitled Form");
	const [formDescription, setFormDescription] = useState<string>("");

	const handleRemoveField = (id: string) => {
		setFields((prevFields) => prevFields.filter((field) => field.id !== id));
	};

	const handleUpdateField = (updatedField: Field) => {
		setFields((prevFields) =>
			prevFields.map((field) =>
				field.id === updatedField.id ? updatedField : field
			)
		);
	};

	const handleAddField = (type: string, insertIndex?: number) => {
		const newField: Field = {
			id: crypto.randomUUID(),
			type: type,
			label: getDefaultLabel(type),
			required: false,
			...(type === "checkbox" || type === "radio"
				? { options: ["Option 1", "Option 2", "Option 3"] }
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

	return (
		<div className="h-full">
			{/* Split view (desktop default and combined view) */}
			{currentView === "split" && (
				<div className="flex h-full">
					{/* Editor Pane */}
					<div className="w-1/2 h-full overflow-y-auto p-6 border-r bg-background">
						<h2 className="text-lg font-semibold mb-6">Editor</h2>
						<EditorPane
							fields={fields}
							formTitle={formTitle}
							formDescription={formDescription}
							onTitleChange={setFormTitle}
							onDescriptionChange={setFormDescription}
							onAddField={handleAddField}
							onUpdateField={handleUpdateField}
							onDeleteField={handleRemoveField}
						/>
					</div>

					{/* Preview Pane */}
					<div className="w-1/2 h-full overflow-y-auto p-6 bg-muted/20">
						<h2 className="text-lg font-semibold mb-6">Preview</h2>
						<PreviewPane
							fields={fields}
							title={formTitle}
							description={formDescription}
						/>
					</div>
				</div>
			)}

			{/* Editor-only view */}
			{currentView === "editor" && (
				<div className="h-full overflow-y-auto p-6 bg-background">
					<div className="max-w-2xl mx-auto">
						<h2 className="text-lg font-semibold mb-6">Editor</h2>
						<EditorPane
							fields={fields}
							formTitle={formTitle}
							formDescription={formDescription}
							onTitleChange={setFormTitle}
							onDescriptionChange={setFormDescription}
							onAddField={handleAddField}
							onUpdateField={handleUpdateField}
							onDeleteField={handleRemoveField}
						/>
					</div>
				</div>
			)}

			{/* Preview-only view */}
			{currentView === "preview" && (
				<div className="h-full overflow-y-auto p-6 bg-muted/20">
					<div className="max-w-2xl mx-auto">
						<h2 className="text-lg font-semibold mb-6">Preview</h2>
						<PreviewPane
							fields={fields}
							title={formTitle}
							description={formDescription}
						/>
					</div>
				</div>
			)}
		</div>
	);
}
