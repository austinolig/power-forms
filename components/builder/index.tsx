"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
} from "lucide-react";

type Field = {
	id: string;
	type: string;
	label: string;
	description?: string;
	options?: string[];
};

function EditorField({
	field,
	onUpdate,
}: {
	field: Field;
	onUpdate: (updatedField: Field) => void;
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

	if (field.type === "text") {
		return (
			<div className="space-y-3">
				<div>
					<Input
						value={field.label}
						onChange={(e) => updateField({ label: e.target.value })}
						placeholder="Field label"
						className="font-medium"
					/>
				</div>
				<div>
					<Input
						value={field.description || ""}
						onChange={(e) => updateField({ description: e.target.value })}
						placeholder="Optional description"
					/>
				</div>
				<div className="pt-6 space-y-3">
					<Label htmlFor={field.id}>{field.label}</Label>
					{field.description && (
						<p className="text-sm text-muted-foreground">{field.description}</p>
					)}
					<Input id={field.id} name={field.id} placeholder="Enter text..." />
				</div>
			</div>
		);
	}

	if (field.type === "number") {
		return (
			<div className="space-y-3">
				<div>
					<Input
						value={field.label}
						onChange={(e) => updateField({ label: e.target.value })}
						placeholder="Field label"
						className="font-medium"
					/>
				</div>
				<div>
					<Input
						value={field.description || ""}
						onChange={(e) => updateField({ description: e.target.value })}
						placeholder="Optional description"
					/>
				</div>
				<div className="pt-6 space-y-3">
					<Label htmlFor={field.id}>{field.label}</Label>
					{field.description && (
						<p className="text-sm text-muted-foreground">{field.description}</p>
					)}
					<Input
						id={field.id}
						name={field.id}
						type="number"
						placeholder="Enter number..."
					/>
				</div>
			</div>
		);
	}

	if (field.type === "email") {
		return (
			<div className="space-y-3">
				<div>
					<Input
						value={field.label}
						onChange={(e) => updateField({ label: e.target.value })}
						placeholder="Field label"
						className="font-medium"
					/>
				</div>
				<div>
					<Input
						value={field.description || ""}
						onChange={(e) => updateField({ description: e.target.value })}
						placeholder="Optional description"
					/>
				</div>
				<div className="pt-6 space-y-3">
					<Label htmlFor={field.id}>{field.label}</Label>
					{field.description && (
						<p className="text-sm text-muted-foreground">{field.description}</p>
					)}
					<Input
						id={field.id}
						name={field.id}
						type="email"
						placeholder="Enter email..."
					/>
				</div>
			</div>
		);
	}

	if (field.type === "textarea") {
		return (
			<div className="space-y-3">
				<div>
					<Input
						value={field.label}
						onChange={(e) => updateField({ label: e.target.value })}
						placeholder="Field label"
						className="font-medium"
					/>
				</div>
				<div>
					<Input
						value={field.description || ""}
						onChange={(e) => updateField({ description: e.target.value })}
						placeholder="Optional description"
					/>
				</div>
				<div className="pt-6 space-y-3">
					<Label htmlFor={field.id}>{field.label}</Label>
					{field.description && (
						<p className="text-sm text-muted-foreground">{field.description}</p>
					)}
					<Textarea id={field.id} name={field.id} placeholder="Enter text..." />
				</div>
			</div>
		);
	}

	if (field.type === "checkbox") {
		const options = field.options || ["Option 1", "Option 2", "Option 3"];

		return (
			<div className="space-y-3">
				<div>
					<Input
						value={field.label}
						onChange={(e) => updateField({ label: e.target.value })}
						placeholder="Field label"
						className="font-medium"
					/>
				</div>
				<div>
					<Input
						value={field.description || ""}
						onChange={(e) => updateField({ description: e.target.value })}
						placeholder="Optional description"
					/>
				</div>
				<div className="space-y-2">
					<Label className="text-sm font-medium">Options:</Label>
					{options.map((option, index) => (
						<div key={index} className="flex items-center gap-2">
							<Input
								value={option}
								onChange={(e) => updateOption(index, e.target.value)}
								placeholder={`Option ${index + 1}`}
								className="flex-1"
							/>
							{options.length > 1 && (
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
						variant="outline"
						size="sm"
						onClick={addOption}
						className="gap-2"
					>
						<Plus className="h-4 w-4" />
						Add Option
					</Button>
				</div>
				<div className="pt-6 space-y-3">
					<Label>{field.label}</Label>
					{field.description && (
						<p className="text-sm text-muted-foreground">{field.description}</p>
					)}
					<div className="space-y-2">
						{options.map((option, index) => (
							<div key={index} className="flex items-center space-x-2">
								<Checkbox id={`${field.id}-${index}`} name={field.id} />
								<Label htmlFor={`${field.id}-${index}`}>{option}</Label>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	if (field.type === "radio") {
		const options = field.options || ["Option 1", "Option 2", "Option 3"];

		return (
			<div className="space-y-3">
				<div>
					<Input
						value={field.label}
						onChange={(e) => updateField({ label: e.target.value })}
						placeholder="Field label"
						className="font-medium"
					/>
				</div>
				<div>
					<Input
						value={field.description || ""}
						onChange={(e) => updateField({ description: e.target.value })}
						placeholder="Optional description"
					/>
				</div>
				<div className="space-y-2">
					<Label className="text-sm font-medium">Options:</Label>
					{options.map((option, index) => (
						<div key={index} className="flex items-center gap-2">
							<Input
								value={option}
								onChange={(e) => updateOption(index, e.target.value)}
								placeholder={`Option ${index + 1}`}
								className="flex-1"
							/>
							{options.length > 1 && (
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
						variant="outline"
						size="sm"
						onClick={addOption}
						className="gap-2"
					>
						<Plus className="h-4 w-4" />
						Add Option
					</Button>
				</div>
				<div className="pt-6 space-y-3">
					<Label>{field.label}</Label>
					{field.description && (
						<p className="text-sm text-muted-foreground">{field.description}</p>
					)}
					<RadioGroup name={field.id}>
						{options.map((option, index) => (
							<div key={index} className="flex items-center space-x-2">
								<RadioGroupItem
									value={`option${index + 1}`}
									id={`${field.id}-option${index + 1}`}
								/>
								<Label htmlFor={`${field.id}-option${index + 1}`}>
									{option}
								</Label>
							</div>
						))}
					</RadioGroup>
				</div>
			</div>
		);
	}
}

export function Builder() {
	const [fields, setFields] = useState<Field[]>([]);

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

	const getFieldTypeName = (type: string) => {
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
		<div className="space-y-4">
			{fields.length === 0 && (
				<div className="text-center space-y-4">
					<p className="text-muted-foreground">
						No fields added yet. Use the button below to add fields.
					</p>
					<AddFieldDropdown />
				</div>
			)}
			{fields.map((field, index) => (
				<React.Fragment key={field.id}>
					<div className="border p-4 rounded-lg bg-card">
						<div className="flex justify-between items-center mb-4">
							<p className="text-sm text-muted-foreground">
								[{getFieldTypeName(field.type)}]
							</p>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => handleRemoveField(field.id)}
								className="text-destructive hover:text-destructive h-8 w-8 p-0"
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
						<EditorField field={field} onUpdate={handleUpdateField} />
					</div>
					<div className="flex justify-center">
						<AddFieldDropdown insertIndex={index} />
					</div>
				</React.Fragment>
			))}
		</div>
	);
}
