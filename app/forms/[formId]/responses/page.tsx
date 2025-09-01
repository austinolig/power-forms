import { getSubmissionsWithPagination } from "@/lib/db";
import { Submission } from "@prisma/client";
import { notFound } from "next/navigation";

interface FormResponsesPageProps {
	params: Promise<{ formId: string }>;
}

export default async function FormResponsesPage({
	params,
}: FormResponsesPageProps) {
	const { formId } = await params;

	const result = await getSubmissionsWithPagination(formId);

	if (!result) {
		notFound();
	}

	const { submissions, total } = result;

	return (
		<div className="container mx-auto py-8">
			<h1 className="text-2xl font-bold mb-6">Form Responses</h1>
			<p className="text-muted-foreground mb-4">Total responses: {total}</p>
			{total === 0 ? (
				<p className="text-muted-foreground">No responses yet.</p>
			) : (
				<div className="space-y-4">
					{submissions.map((submission: Submission) => (
						<div key={submission.id} className="border rounded-lg p-4 bg-card">
							<div className="flex justify-between items-center">
								<span className="font-medium">
									Response #{submission.id.slice(-8)}
								</span>
								<span className="text-sm text-muted-foreground">
									{new Date(submission.submittedAt).toLocaleString()}
								</span>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
