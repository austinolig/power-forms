"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit3, Eye, Columns2 } from "lucide-react";

interface EditorFormButtonsProps {
	activeView?: string;
	onViewChange?: (view: string) => void;
}

export function EditorFormButtons({
	activeView = "editor",
	onViewChange,
}: EditorFormButtonsProps) {
	return (
		<div className="flex items-center gap-4">
			<Tabs value={activeView} onValueChange={onViewChange}>
				<TabsList>
					<TabsTrigger value="editor" className="gap-2">
						<Edit3 className="h-4 w-4" />
						<span className="hidden sm:inline">Editor</span>
					</TabsTrigger>
					<TabsTrigger value="preview" className="gap-2">
						<Eye className="h-4 w-4" />
						<span className="hidden sm:inline">Preview</span>
					</TabsTrigger>
					<TabsTrigger value="split" className="gap-2 hidden lg:flex">
						<Columns2 className="h-4 w-4" />
						<span className="hidden sm:inline">Split View</span>
					</TabsTrigger>
				</TabsList>
			</Tabs>
			<div className="flex items-center gap-1">
				<Button size="sm" onClick={() => {}} title="Save" className="mr-2.5">
					Save
				</Button>
			</div>
		</div>
	);
}
