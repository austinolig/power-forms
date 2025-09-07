import { getFormsWithPagination } from "@/lib/db";
import { Dashboard } from "@/components/dashboard";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function FormsPage() {
	const forms = await getFormsWithPagination();

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center py-6">
						<div>
							<h1 className="text-3xl font-bold text-gray-900">PowerForms</h1>
							<p className="text-gray-600 mt-1">
								Create and share your forms with ease.
							</p>
						</div>
						<Link href="/forms/create">
							<Button>
								<Plus />
								<span>Create Form</span>
							</Button>
						</Link>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<Dashboard forms={forms} />
			</div>
		</div>
	);
}
