"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
	searchQuery: string;
	onSearchChange: (query: string) => void;
}

export function SearchBar({ searchQuery, onSearchChange }: SearchBarProps) {
	return (
		<div className="relative max-w-md">
			<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
			<input
				type="text"
				placeholder="Search forms..."
				value={searchQuery}
				onChange={(e) => onSearchChange(e.target.value)}
				className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
			/>
		</div>
	);
}
