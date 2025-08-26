"use client";

import { Plus } from "lucide-react";
import { createFormAction } from "@/lib/actions";

export function CreateFormButton() {
	const handleCreateNew = async () => {
		console.log("Create new form");

		const response = await createFormAction({
			title: "New Form",
			description: "",
			fields: [],
		});

		if (response.success) {
			alert(`Form created with ID: ${response.data.id}`);
		} else {
			alert(`Error creating form: ${response.error}`);
		}
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
