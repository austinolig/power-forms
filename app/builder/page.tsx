"use client";

import { useState, useEffect } from "react";
import { Builder } from "@/components/builder";
import { EditorFormButtons } from "@/components/editor-form-buttons";

export default function BuilderPage() {
	const [currentView, setCurrentView] = useState<string>("editor");

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 1024) {
				setCurrentView("split");
			} else {
				setCurrentView("editor");
			}
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<div className="h-screen flex flex-col">
			<div className="p-4 border-b flex justify-between items-center">
				<h1 className="text-xl font-bold">Power Forms</h1>
				<EditorFormButtons
					activeView={currentView}
					onViewChange={setCurrentView}
				/>
			</div>
			<div className="flex-1 overflow-hidden">
				<Builder currentView={currentView} />
			</div>
		</div>
	);
}
