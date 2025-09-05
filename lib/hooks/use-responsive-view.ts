"use client";

import { useState, useEffect } from "react";
import { ViewType, VIEW_TYPES } from "@/types/field";

export function useResponsiveView(defaultView: ViewType = VIEW_TYPES.EDITOR) {
	const [currentView, setCurrentView] = useState<ViewType>(defaultView);

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 1024 && currentView === VIEW_TYPES.SPLIT) {
				setCurrentView(VIEW_TYPES.EDITOR);
			}
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [currentView]);

	return {
		currentView,
		setCurrentView,
	};
}
