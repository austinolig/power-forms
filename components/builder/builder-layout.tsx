"use client";

import { ReactNode } from "react";
import { BuilderHeader } from "./builder-header";

interface BuilderLayoutProps {
	children: ReactNode;
	activeView: string;
	onViewChange: (view: string) => void;
}

export function BuilderLayout({
	children,
	activeView,
	onViewChange,
}: BuilderLayoutProps) {
	return (
		<div className="h-screen flex flex-col">
			<BuilderHeader activeView={activeView} onViewChange={onViewChange} />
			<div className="flex-1 overflow-hidden">{children}</div>
		</div>
	);
}
