"use client";

import { useState } from "react";
import type { FormsListResult } from "@/types/db";
import { Plus } from "lucide-react";
import { SearchBar } from "./search-bar";
import { FormCard } from "./form-card";

interface DashboardProps {
	forms: FormsListResult;
}

export function Dashboard({ forms }: DashboardProps) {
	const [searchQuery, setSearchQuery] = useState("");

	const filteredForms =
		forms?.forms.filter(
			(form) =>
				form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(form.description &&
					form.description.toLowerCase().includes(searchQuery.toLowerCase()))
		) || [];

	const handleCreateNew = () => {
		console.log("Create new form");
	};

	return (
		<>
			{/* Search Bar */}
			<div className="mb-8">
				<SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
			</div>

			{/* Forms Grid */}
			{filteredForms.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredForms.map((form) => (
						<FormCard key={form.id} form={form} />
					))}
				</div>
			) : (
				<div className="text-center py-12">
					<div className="text-gray-400 mb-4">
						<Plus className="w-16 h-16 mx-auto mb-4" />
					</div>
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						{searchQuery ? "No forms found" : "No forms yet"}
					</h3>
					<p className="text-gray-600 mb-6">
						{searchQuery
							? "Try adjusting your search terms"
							: "Get started by creating your first form"}
					</p>
					{!searchQuery && (
						<button
							onClick={handleCreateNew}
							className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium inline-flex items-center gap-2"
						>
							<Plus className="w-5 h-5" />
							Create Your First Form
						</button>
					)}
				</div>
			)}
		</>
	);
}
