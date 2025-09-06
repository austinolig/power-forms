"use client";

import React from "react";
import { ViewTabs } from "./view-tabs";
import { SaveDialog } from "./save-dialog";
import { useFormBuilder } from "@/lib/hooks/use-form-builder";
import { useResponsiveView } from "@/lib/hooks/use-responsive-view";
import { VIEW_TYPES } from "@/types/field";
import { EditorPane } from "./editor-pane";
import { PreviewPane } from "./preview-pane";
import Link from "next/link";
import { Field } from "@/types/field";

interface BuilderProps {
	initialFormId?: string;
	initialTitle?: string;
	initialDescription?: string;
	initialFields?: Field[];
}

export function Builder({
	initialFormId,
	initialTitle,
	initialDescription,
	initialFields,
}: BuilderProps) {
	const { currentView, setCurrentView } = useResponsiveView(VIEW_TYPES.EDITOR);

	const {
		formTitle,
		formDescription,
		fields,
		setFormTitle,
		setFormDescription,
		handleAddField,
		handleUpdateField,
		handleRemoveField,
	} = useFormBuilder({
		initialTitle,
		initialDescription,
		initialFields,
	});

	const editorProps = {
		fields,
		formTitle,
		formDescription,
		onTitleChange: setFormTitle,
		onDescriptionChange: setFormDescription,
		onAddField: handleAddField,
		onUpdateField: handleUpdateField,
		onDeleteField: handleRemoveField,
	};

	const previewProps = {
		formId: initialFormId,
		fields,
		title: formTitle,
		description: formDescription,
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
				{currentView === VIEW_TYPES.SPLIT && (
					<div className="flex h-full">
						<div className="w-1/2 h-full overflow-y-auto p-6 border-r bg-background">
							<EditorPane {...editorProps} />
						</div>
						<div className="w-1/2 h-full overflow-y-auto p-6 bg-muted/20">
							<PreviewPane {...previewProps} />
						</div>
					</div>
				)}
				{currentView === VIEW_TYPES.EDITOR && (
					<div className="h-full overflow-y-auto p-6 bg-background">
						<EditorPane {...editorProps} />
					</div>
				)}
				{currentView === VIEW_TYPES.PREVIEW && (
					<div className="h-full overflow-y-auto p-6 bg-muted/20">
						<PreviewPane {...previewProps} />
					</div>
				)}
			</div>
		</div>
	);
}
