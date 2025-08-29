"use client";

import { BuilderHeader } from "./builder-header";
import { useResponsiveView } from "@/components/builder/use-responsive-view";
import { Builder } from "@/components/builder";

export function BuilderLayout() {
	const { currentView, setCurrentView } = useResponsiveView("editor");

	return (
		<div className="h-screen flex flex-col">
			<BuilderHeader activeView={currentView} onViewChange={setCurrentView} />
			<div className="flex-1 overflow-hidden">
				<Builder currentView={currentView} />
			</div>
		</div>
	);
}
