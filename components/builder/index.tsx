"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Plus,
	Type,
	Hash,
	Mail,
	AlignLeft,
	CheckSquare,
	Circle,
	Trash2,
	X,
	Settings,
	Zap,
	Asterisk,
} from "lucide-react";

type Field = {
	id: string;
	type: string;
	label: string;
	description?: string;
	options?: string[];
	required?: boolean;
};

function EditorField({
	field,
	onUpdate,
	onDelete,
}: {
	field: Field;
	onUpdate: (updatedField: Field) => void;
	onDelete: (id: string) => void;
}) {
	const updateField = (updates: Partial<Field>) => {
		onUpdate({ ...field, ...updates });
	};

	const updateOption = (index: number, value: string) => {
		const newOptions = [...(field.options || [])];
		newOptions[index] = value;
		updateField({ options: newOptions });
	};

	const addOption = () => {
		const newOptions = [
			...(field.options || []),
			`Option ${(field.options?.length || 0) + 1}`,
		];
		updateField({ options: newOptions });
	};

	const removeOption = (index: number) => {
		const newOptions = field.options?.filter((_, i) => i !== index) || [];
		updateField({ options: newOptions });
	};

	const getFieldIcon = (type: string) => {
		switch (type) {
			case "text":
				return <Type className="h-4 w-4" />;
			case "number":
				return <Hash className="h-4 w-4" />;
			case "email":
				return <Mail className="h-4 w-4" />;
			case "textarea":
				return <AlignLeft className="h-4 w-4" />;
			case "checkbox":
				return <CheckSquare className="h-4 w-4" />;
			case "radio":
				return <Circle className="h-4 w-4" />;
			default:
				return <Type className="h-4 w-4" />;
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center pb-6 mb-6 border-b">
				<Badge variant="secondary" className="gap-2">
					{getFieldIcon(field.type)}
					{getFieldTypeName(field.type)}
				</Badge>
				<div className="flex items-center gap-1">
					<Toggle
						pressed={field.required}
						onPressedChange={(pressed) => updateField({ required: pressed })}
						size="sm"
						title={field.required ? "Required field" : "Optional field"}
					>
						<Asterisk className="h-4 w-4" />
					</Toggle>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => {}}
						className="h-8 w-8 p-0"
						title="AI Assist"
					>
						<Zap className="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => {}}
						className="h-8 w-8 p-0"
						title="Settings"
					>
						<Settings className="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => onDelete(field.id)}
						className="text-destructive hover:text-destructive h-8 w-8 p-0"
						title="Delete field"
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>
			</div>
			<div>
				<Label className="text-sm mb-2">Label</Label>
				<Input
					value={field.label}
					onChange={(e) => updateField({ label: e.target.value })}
					placeholder="Field label"
				/>
			</div>
			<div>
				<Label className="text-sm mb-2">Description (Optional)</Label>
				<Input
					value={field.description || ""}
					onChange={(e) => updateField({ description: e.target.value })}
					placeholder="Description"
				/>
			</div>
			{(field.type === "checkbox" || field.type === "radio") && (
				<div className="space-y-2">
					<Label className="text-sm font-medium">Options</Label>
					{(field.options || []).map((option, index) => (
						<div key={index} className="flex items-center gap-2">
							<Input
								value={option}
								onChange={(e) => updateOption(index, e.target.value)}
								placeholder={`Option ${index + 1}`}
								className="flex-1"
							/>
							{(field.options?.length || 0) > 1 && (
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={() => removeOption(index)}
									className="text-destructive hover:text-destructive"
								>
									<X className="h-4 w-4" />
								</Button>
							)}
						</div>
					))}
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={addOption}
						className="gap-2"
					>
						<Plus className="h-4 w-4" />
					</Button>
				</div>
			)}
		</div>
	);

	function getFieldTypeName(type: string) {
		switch (type) {
			case "text":
				return "Text Input";
			case "number":
				return "Number Input";
			case "email":
				return "Email Input";
			case "textarea":
				return "Textarea";
			case "checkbox":
				return "Checkbox Group";
			case "radio":
				return "Radio Group";
			default:
				return type;
		}
	}
}

function FormHeader({
	title,
	description,
	onTitleChange,
	onDescriptionChange,
}: {
	title: string;
	description: string;
	onTitleChange: (title: string) => void;
	onDescriptionChange: (description: string) => void;
}) {
	return (
		<div className="space-y-6">
			<div>
				<Label className="text-sm mb-2">Form Title</Label>
				<Input
					value={title}
					onChange={(e) => onTitleChange(e.target.value)}
					placeholder="Enter form title..."
				/>
			</div>
			<div>
				<Label className="text-sm mb-2">Form Description (Optional)</Label>
				<Textarea
					value={description}
					onChange={(e) => onDescriptionChange(e.target.value)}
					placeholder="Enter form description..."
					rows={3}
				/>
			</div>
		</div>
	);
}

function PreviewField({ field }: { field: Field }) {
	if (field.type === "text") {
		return (
			<div className="space-y-2">
				<Label htmlFor={field.id}>{field.label}</Label>
				{field.description && (
					<p className="text-sm text-muted-foreground">{field.description}</p>
				)}
				<Input
					id={field.id}
					name={field.id}
					placeholder="Enter text..."
					required={field.required}
				/>
			</div>
		);
	}

	if (field.type === "number") {
		return (
			<div className="space-y-2">
				<Label htmlFor={field.id}>{field.label}</Label>
				{field.description && (
					<p className="text-sm text-muted-foreground">{field.description}</p>
				)}
				<Input
					id={field.id}
					name={field.id}
					type="number"
					placeholder="Enter number..."
					required={field.required}
				/>
			</div>
		);
	}

	if (field.type === "email") {
		return (
			<div className="space-y-2">
				<Label htmlFor={field.id}>{field.label}</Label>
				{field.description && (
					<p className="text-sm text-muted-foreground">{field.description}</p>
				)}
				<Input
					id={field.id}
					name={field.id}
					type="email"
					placeholder="Enter email..."
					required={field.required}
				/>
			</div>
		);
	}

	if (field.type === "textarea") {
		return (
			<div className="space-y-2">
				<Label htmlFor={field.id}>{field.label}</Label>
				{field.description && (
					<p className="text-sm text-muted-foreground">{field.description}</p>
				)}
				<Textarea
					id={field.id}
					name={field.id}
					placeholder="Enter text..."
					required={field.required}
				/>
			</div>
		);
	}

	if (field.type === "checkbox") {
		const options = field.options || [];
		return (
			<div className="space-y-2">
				<Label>{field.label}</Label>
				{field.description && (
					<p className="text-sm text-muted-foreground">{field.description}</p>
				)}
				<div className="space-y-2">
					{options.map((option, index) => (
						<div key={index} className="flex items-center space-x-2">
							<Checkbox
								id={`${field.id}-${index}`}
								name={field.id}
								required={field.required}
							/>
							<Label htmlFor={`${field.id}-${index}`}>{option}</Label>
						</div>
					))}
				</div>
			</div>
		);
	}

	if (field.type === "radio") {
		const options = field.options || [];
		return (
			<div className="space-y-2">
				<Label>{field.label}</Label>
				{field.description && (
					<p className="text-sm text-muted-foreground">{field.description}</p>
				)}
				<RadioGroup name={field.id} required={field.required}>
					{options.map((option, index) => (
						<div key={index} className="flex items-center space-x-2">
							<RadioGroupItem
								value={`option${index + 1}`}
								id={`${field.id}-option${index + 1}`}
							/>
							<Label htmlFor={`${field.id}-option${index + 1}`}>{option}</Label>
						</div>
					))}
				</RadioGroup>
			</div>
		);
	}

	return null;
}

function PreviewPane({
	fields,
	title,
	description,
}: {
	fields: Field[];
	title: string;
	description: string;
}) {
	return (
		<div>
			<div className="mb-6">
				<p className="text-2xl font-bold">{title}</p>
				{description && (
					<p className="text-muted-foreground mt-2">{description}</p>
				)}
			</div>
			{fields.length === 0 ? (
				<div className="text-center space-y-4 py-6">
					<p className="text-muted-foreground">No fields to display.</p>
					<p className="text-sm text-muted-foreground">
						Add fields in the editor pane to see a preview here.
					</p>
				</div>
			) : (
				<form className="space-y-6">
					{fields.map((field) => (
						<PreviewField key={field.id} field={field} />
					))}
					<Button type="submit" className="w-full">
						Submit
					</Button>
				</form>
			)}
		</div>
	);
}

interface BuilderProps {
	currentView?: string;
	onViewChange?: (view: string) => void;
}

export function Builder({ currentView = "split", onViewChange }: BuilderProps) {
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
		const getDefaultLabel = (type: string) => {
			switch (type) {
				case "email":
					return "Email Address";
				case "number":
					return "Number";
				case "textarea":
					return "Message";
				default:
					return type.charAt(0).toUpperCase() + type.slice(1);
			}
		};

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

	const AddFieldDropdown = ({ insertIndex }: { insertIndex?: number }) => (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className="gap-2">
					<Plus className="h-4 w-4" />
					Add Field
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem onClick={() => handleAddField("text", insertIndex)}>
					<Type className="h-4 w-4 mr-2" />
					Text Input
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => handleAddField("number", insertIndex)}>
					<Hash className="h-4 w-4 mr-2" />
					Number Input
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => handleAddField("email", insertIndex)}>
					<Mail className="h-4 w-4 mr-2" />
					Email Input
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => handleAddField("textarea", insertIndex)}
				>
					<AlignLeft className="h-4 w-4 mr-2" />
					Textarea
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => handleAddField("checkbox", insertIndex)}
				>
					<CheckSquare className="h-4 w-4 mr-2" />
					Checkbox Group
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => handleAddField("radio", insertIndex)}>
					<Circle className="h-4 w-4 mr-2" />
					Radio Group
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);

	return (
		<div className="h-full">
			{/* Split view (desktop default and combined view) */}
			{currentView === "split" && (
				<div className="flex h-full">
					{/* Editor Pane */}
					<div className="w-1/2 h-full overflow-y-auto p-6 border-r bg-background">
						<h2 className="text-lg font-semibold mb-6">Editor</h2>
						<div className="space-y-6">
							<FormHeader
								title={formTitle}
								description={formDescription}
								onTitleChange={setFormTitle}
								onDescriptionChange={setFormDescription}
							/>
							<div className="flex justify-center">
								<AddFieldDropdown insertIndex={fields.length > 0 ? -1 : 0} />
							</div>
							{fields.map((field, index) => (
								<React.Fragment key={field.id}>
									<div className="border p-6 rounded-lg bg-card">
										<EditorField
											field={field}
											onUpdate={handleUpdateField}
											onDelete={handleRemoveField}
										/>
									</div>
									<div className="flex justify-center">
										<AddFieldDropdown insertIndex={index} />
									</div>
								</React.Fragment>
							))}
						</div>
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
						<div className="space-y-6">
							<FormHeader
								title={formTitle}
								description={formDescription}
								onTitleChange={setFormTitle}
								onDescriptionChange={setFormDescription}
							/>
							<div className="flex justify-center">
								<AddFieldDropdown insertIndex={fields.length > 0 ? -1 : 0} />
							</div>
							{fields.map((field, index) => (
								<React.Fragment key={field.id}>
									<div className="border p-6 rounded-lg bg-card">
										<EditorField
											field={field}
											onUpdate={handleUpdateField}
											onDelete={handleRemoveField}
										/>
									</div>
									<div className="flex justify-center">
										<AddFieldDropdown insertIndex={index} />
									</div>
								</React.Fragment>
							))}
						</div>
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
