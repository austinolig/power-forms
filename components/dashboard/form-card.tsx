import {
	Calendar,
	Users,
	ExternalLink,
	Edit3,
	Trash2,
	Copy,
} from "lucide-react";
import { FormsListItem } from "@/types/db";
import { formatDate } from "@/lib/utils";
import { deleteFormAction } from "@/lib/actions";

interface FormCardProps {
	form: FormsListItem;
}

export function FormCard({ form }: FormCardProps) {
	const handleCopyLink = () => {
		const url = `${window.location.origin}/forms/${form.id}`;
		navigator.clipboard.writeText(url).then(() => {
			console.log("Link copied to clipboard", url);
		});
	};

	const handleEdit = () => {
		console.log("Edit form:", form.id);
	};

	const handleDelete = async () => {
		if (!confirm("Are you sure you want to delete this form?")) return;

		try {
			await deleteFormAction(form.id);
			// Refresh the page to update the forms list
			window.location.reload();
		} catch (err) {
			alert("Failed to delete form");
			console.error("Delete error:", err);
		}
	};

	return (
		<div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
			<div className="flex justify-between items-start mb-4">
				<div className="flex-1">
					<h3 className="text-lg font-semibold text-gray-900 mb-2">
						{form.title}
					</h3>
					{form.description && (
						<p className="text-gray-600 text-sm mb-3 line-clamp-2">
							{form.description}
						</p>
					)}
					<div className="flex items-center gap-4 text-sm text-gray-500">
						<div className="flex items-center gap-1">
							<Calendar className="w-4 h-4" />
							<span>{formatDate(form.createdAt)}</span>
						</div>
						<div className="flex items-center gap-1">
							<Users className="w-4 h-4" />
							<span>{form._count.submissions} responses</span>
						</div>
					</div>
				</div>
			</div>

			<div className="flex justify-between items-center pt-4 border-t border-gray-100">
				<a
					href={`/forms/${form.id}`}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
				>
					<ExternalLink className="w-4 h-4" />
					View Form
				</a>

				<div key={form.id} className="flex items-center gap-1">
					<button
						onClick={handleCopyLink}
						className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
						title="Copy Link"
					>
						<Copy className="w-4 h-4" />
					</button>
					<button
						onClick={handleEdit}
						className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
						title="Edit Form"
					>
						<Edit3 className="w-4 h-4" />
					</button>
					<button
						onClick={handleDelete}
						className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
						title="Delete Form"
					>
						<Trash2 className="w-4 h-4" />
					</button>
				</div>
			</div>
		</div>
	);
}
