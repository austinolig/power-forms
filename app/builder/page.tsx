"use client";

import { Builder } from "@/components/builder";
import { BuilderLayout } from "@/components/builder/builder-layout";
import { useResponsiveView } from "@/components/builder/use-responsive-view";

export default function BuilderPage() {
	const { currentView, setCurrentView } = useResponsiveView("editor");

	return (
		<BuilderLayout activeView={currentView} onViewChange={setCurrentView}>
			<Builder currentView={currentView} />
		</BuilderLayout>
	);
}
