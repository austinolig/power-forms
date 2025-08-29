"use client";

import { Button } from "@/components/ui/button";
import { Settings, Trash2 } from "lucide-react";

export function EditorFormButtons() {
	return (
		<div className="flex items-center gap-1">
			<Button size="sm" onClick={() => {}} title="Save" className="mr-2.5">
				Save
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
				onClick={() => {}}
				className="text-destructive hover:text-destructive h-8 w-8 p-0"
				title="Delete field"
			>
				<Trash2 className="h-4 w-4" />
			</Button>
		</div>
	);
}
