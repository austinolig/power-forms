import { getSubmissionsWithPagination } from "@/lib/db";
import { Submission } from "@prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
			<div className="flex justify-between items-center mb-6">
				<div>
					<h1 className="text-2xl font-bold">Form Responses</h1>
					<p className="text-muted-foreground">Total responses: {total}</p>
				</div>
				{total > 0 && (
					<Button asChild>
						<a href={`/api/forms/${formId}/responses/export`} download>
							Export All as CSV
						</a>
					</Button>
				)}
			</div>
			{total === 0 ? (
				<p className="text-muted-foreground">No responses yet.</p>
			) : (
				<div className="space-y-4">
					{submissions.map((submission: Submission) => (
						<Link
							key={submission.id}
							href={`/forms/${formId}/responses/${submission.id}`}
							className="block border rounded-lg p-4 bg-card hover:bg-accent transition-colors"
						>
							<div className="flex justify-between items-center">
								<span className="font-medium">
									Response #{submission.id.slice(-8)}
								</span>
								<span className="text-sm text-muted-foreground">
									{new Date(submission.submittedAt).toLocaleString()}
								</span>
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
