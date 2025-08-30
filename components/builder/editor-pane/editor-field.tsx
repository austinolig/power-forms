"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";
import { Trash2, X, Settings, Zap, Asterisk } from "lucide-react";
import { Field, getFieldIcon, getFieldTypeName } from "../field-utils";

interface EditorFieldProps {
	field: Field;
	onUpdate: (updatedField: Field) => void;
	onDelete: (id: string) => void;
}

export function EditorField({ field, onUpdate, onDelete }: EditorFieldProps) {
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
						Add Option
					</Button>
				</div>
			)}
		</div>
	);
}
