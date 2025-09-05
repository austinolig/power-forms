"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";
import { Trash2, X, Asterisk, Plus } from "lucide-react";
import { Field, FieldSettings } from "@/types/field";
import { getFieldIcon, getFieldTypeName } from "./field-helpers";
import { FieldSettingsDialog } from "./settings-dialog";
import { FieldLogicDialog } from "./logic-dialog";

interface EditorFieldProps {
	field: Field;
	onUpdate: (updatedField: Field) => void;
	onDelete: (id: string) => void;
}

export function EditorField({ field, onUpdate, onDelete }: EditorFieldProps) {
	const updateField = (updates: Partial<Field>) => {
		onUpdate({ ...field, ...updates });
	};

	const handleUpdateOption = (index: number, value: string) => {
		onUpdate({
			...field,
			options:
				field.options?.map((opt, i) => (i === index ? value : opt)) || [],
		});
	};

	const handleAddOption = () => {
		onUpdate({
			...field,
			options: [
				...(field.options || []),
				`Option ${(field.options?.length || 0) + 1}`,
			],
		});
	};

	const handleRemoveOption = (index: number) => {
		onUpdate({
			...field,
			options: field.options?.filter((_, i) => i !== index) || [],
		});
	};

	const handleSaveSettings = (settings: FieldSettings) => {
		onUpdate({ ...field, settings });
	};

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center pb-6 mb-6 border-b">
				<div className="flex items-center space-x-3">
					<span>{getFieldIcon(field.type)}</span>
					<Badge variant="secondary">{getFieldTypeName(field.type)}</Badge>
				</div>
				<div className="flex items-center space-x-2">
					<Toggle
						pressed={field.required}
						onPressedChange={(pressed) => updateField({ required: pressed })}
						aria-label="Toggle required"
						size="sm"
					>
						<Asterisk className="h-4 w-4" />
					</Toggle>
					<FieldLogicDialog />
					<FieldSettingsDialog field={field} onSave={handleSaveSettings} />
					<Button variant="ghost" size="sm" onClick={() => onDelete(field.id)}>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>
			</div>

			<div className="space-y-2">
				<Label className="text-sm">Field Label</Label>
				<Input
					value={field.label}
					onChange={(e) => updateField({ label: e.target.value })}
					placeholder="Enter field label..."
				/>
			</div>

			<div className="space-y-2">
				<Label className="text-sm">Field Description (Optional)</Label>
				<Input
					value={field.description || ""}
					onChange={(e) => updateField({ description: e.target.value })}
					placeholder="Enter field description..."
				/>
			</div>

			{(field.type === "checkbox" || field.type === "radio") && (
				<div className="space-y-4">
					<Label className="text-sm">Options</Label>
					<div className="space-y-2">
						{field.options?.map((option: string, index: number) => (
							<div key={index} className="flex items-center space-x-2">
								<Input
									value={option}
									onChange={(e) => handleUpdateOption(index, e.target.value)}
									placeholder="Option text"
								/>
								<Button
									variant="outline"
									size="sm"
									onClick={() => handleRemoveOption(index)}
									disabled={field.options?.length === 1}
								>
									<X className="h-4 w-4" />
								</Button>
							</div>
						))}
					</div>
					<Button variant="outline" size="sm" onClick={handleAddOption}>
						<Plus className="h-4 w-4" />
						Add Option
					</Button>
				</div>
			)}
		</div>
	);
}
