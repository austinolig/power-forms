"use client";

import { Plus } from "lucide-react";

export function CreateFormButton() {
	const handleCreateNew = () => {
		console.log("Create new form");
	};

	return (
		<button
			onClick={handleCreateNew}
			className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium inline-flex items-center gap-2 transition-colors"
		>
			<Plus className="w-5 h-5" />
			Create New Form
		</button>
	);
}
