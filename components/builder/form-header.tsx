"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface FormHeaderProps {
	title: string;
	description: string;
	onTitleChange: (title: string) => void;
	onDescriptionChange: (description: string) => void;
}

export function FormHeader({
	title,
	description,
	onTitleChange,
	onDescriptionChange,
}: FormHeaderProps) {
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
