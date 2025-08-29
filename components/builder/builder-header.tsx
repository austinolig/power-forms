"use client";

import { EditorFormButtons } from "@/components/editor-form-buttons";

interface BuilderHeaderProps {
	activeView: string;
	onViewChange: (view: string) => void;
}

export function BuilderHeader({
	activeView,
	onViewChange,
}: BuilderHeaderProps) {
	return (
		<div className="p-4 border-b flex justify-between items-center">
			<h1 className="text-xl font-bold">Power Forms</h1>
			<EditorFormButtons activeView={activeView} onViewChange={onViewChange} />
		</div>
	);
}
