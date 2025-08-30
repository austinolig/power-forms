"use client";

import React, { useState } from "react";
import { ViewTabs } from "./view-tabs";
import { EditorPane } from "./editor-pane";
import { PreviewPane } from "./preview-pane";
import { Field, getDefaultLabel } from "./field-utils";
import { useResponsiveView } from "./use-responsive-view";
import { Button } from "@/components/ui/button";

export function Builder() {
	const { currentView, setCurrentView } = useResponsiveView("editor");
	const [formTitle, setFormTitle] = useState<string>("Untitled Form");
	const [formDescription, setFormDescription] = useState<string>("");
	const [fields, setFields] = useState<Field[]>([]);

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

	return (
		<div className="h-dvh flex flex-col">
			<div className="p-4 border-b flex justify-between items-center">
				<h1 className="text-xl font-bold">PowerForms</h1>
				<div className="flex items-center gap-4">
					<ViewTabs currentView={currentView} setCurrentView={setCurrentView} />
					<Button size="sm" onClick={() => {}} title="Save" className="mr-2.5">
						Save
					</Button>
				</div>
			</div>
			<div className="flex-1 overflow-hidden">
				{currentView === "split" && (
					<div className="flex h-full">
						<div className="w-1/2 h-full overflow-y-auto p-6 border-r bg-background">
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

						<div className="w-1/2 h-full overflow-y-auto p-6 bg-muted/20">
							<PreviewPane
								fields={fields}
								title={formTitle}
								description={formDescription}
							/>
						</div>
					</div>
				)}

				{currentView === "editor" && (
					<div className="h-full overflow-y-auto p-6 bg-background">
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
				)}

				{currentView === "preview" && (
					<div className="h-full overflow-y-auto p-6 bg-muted/20">
						<PreviewPane
							fields={fields}
							title={formTitle}
							description={formDescription}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
