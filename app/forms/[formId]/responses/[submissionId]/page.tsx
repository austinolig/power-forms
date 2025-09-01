import { getSubmissionWithForm } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SubmissionPageProps {
	params: Promise<{ formId: string; submissionId: string }>;
}

export default async function SubmissionPage({ params }: SubmissionPageProps) {
	const { formId, submissionId } = await params;

	const submission = await getSubmissionWithForm(submissionId);

	if (!submission || submission.formId !== formId) {
		notFound();
	}

	const { form, data, submittedAt } = submission;
	const submissionData = data as Record<
		string,
		string | number | boolean | null
	>;
	const fields = form.fields as Array<{
		id: string;
		type: string;
		label: string;
		[key: string]: unknown;
	}>;

	return (
		<div className="container mx-auto py-8">
			<div className="flex justify-between items-center mb-6">
				<Link
					href={`/forms/${formId}/responses`}
					className="text-blue-600 hover:underline"
				>
					← Back to Responses
				</Link>
				<Button asChild>
					<a
						href={`/api/forms/${formId}/responses/${submissionId}/export`}
						download
					>
						Export as CSV
					</a>
				</Button>
			</div>

			<div className="space-y-6">
				<div className="border rounded-lg p-6 bg-card">
					<h1 className="text-2xl font-bold mb-4">Form Information</h1>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="font-medium">Title:</label>
							<p className="text-muted-foreground">{form.title}</p>
						</div>
						{form.description && (
							<div>
								<label className="font-medium">Description:</label>
								<p className="text-muted-foreground">{form.description}</p>
							</div>
						)}
						<div>
							<label className="font-medium">Created:</label>
							<p className="text-muted-foreground">
								{new Date(form.createdAt).toLocaleString()}
							</p>
						</div>
						<div>
							<label className="font-medium">Last Updated:</label>
							<p className="text-muted-foreground">
								{new Date(form.updatedAt).toLocaleString()}
							</p>
						</div>
					</div>
				</div>

				<div className="border rounded-lg p-6 bg-card">
					<h2 className="text-xl font-bold mb-4">Submission Information</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="font-medium">Submission ID:</label>
							<p className="text-muted-foreground font-mono">{submissionId}</p>
						</div>
						<div>
							<label className="font-medium">Submitted At:</label>
							<p className="text-muted-foreground">
								{new Date(submittedAt).toLocaleString()}
							</p>
						</div>
					</div>
				</div>

				<div className="border rounded-lg p-6 bg-card">
					<h2 className="text-xl font-bold mb-4">Form Responses</h2>
					<div className="space-y-4">
						{fields.map((field) => {
							const response = submissionData[field.id];
							return (
								<div key={field.id} className="border-b pb-4 last:border-b-0">
									<div className="flex justify-between items-start">
										<div className="flex-1">
											<label className="font-medium">{field.label}</label>
											<p className="text-sm text-muted-foreground">
												Type: {field.type}
											</p>
										</div>
										<div className="flex-1">
											<p className="text-right">
												{response !== undefined && response !== null ? (
													String(response)
												) : (
													<span className="text-muted-foreground italic">
														No response
													</span>
												)}
											</p>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
