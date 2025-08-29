"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Field, PreviewField } from "./preview-field";

interface PreviewPaneProps {
	fields: Field[];
	title: string;
	description: string;
}

export function PreviewPane({ fields, title, description }: PreviewPaneProps) {
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
