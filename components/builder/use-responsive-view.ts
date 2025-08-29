"use client";

import { useState, useEffect } from "react";

export function useResponsiveView(defaultView: string = "editor") {
	const [currentView, setCurrentView] = useState<string>(defaultView);

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

	return {
		currentView,
		setCurrentView,
	};
}
