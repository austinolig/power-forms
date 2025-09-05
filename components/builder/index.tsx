"use client";

import React, { useState, useEffect } from "react";
import { ViewTabs } from "./view-tabs";
import { EditorPane } from "./editor-pane";
import { PreviewPane } from "./preview-pane";
import { Field } from "@/types/field"
import { getDefaultLabel } from "./field-utils";
import { useResponsiveView } from "./use-responsive-view";
import { SaveDialog } from "./save-dialog";
import Link from "next/link";

interface BuilderProps {
	initialFormId?: string;
	initialTitle?: string;
	initialDescription?: string;
	initialFields?: Field[];
}

export function Builder({
	initialFormId,
	initialTitle = "Untitled Form",
	initialDescription = "",
	initialFields = [],
}: BuilderProps) {
	const { currentView, setCurrentView } = useResponsiveView("editor");

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
				<Link href={"/"}>
					<h1 className="text-xl font-bold">PowerForms</h1>
				</Link>
				<div className="flex items-center gap-4">
					<ViewTabs currentView={currentView} setCurrentView={setCurrentView} />
					<SaveDialog
						formId={initialFormId}
						formTitle={formTitle}
						formDescription={formDescription}
						fields={fields}
					/>
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
