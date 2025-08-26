import { getFormsWithPagination } from "@/lib/db";
import { CreateFormButton } from "@/components/create-form-button";
import { Dashboard } from "@/components/dashboard";

export default async function Home() {
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
						<CreateFormButton />
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
