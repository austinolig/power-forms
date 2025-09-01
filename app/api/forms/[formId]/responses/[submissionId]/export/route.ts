import { NextRequest, NextResponse } from "next/server";
import { getSubmissionWithForm } from "@/lib/db";
import { notFound } from "next/navigation";

interface RouteParams {
	params: Promise<{ formId: string; submissionId: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
	const { formId, submissionId } = await params;

	const submission = await getSubmissionWithForm(submissionId);

	if (!submission || submission.formId !== formId) {
		notFound();
	}

	const { form, data, submittedAt } = submission;
	const submissionData = data as Record<string, unknown>;
	const fields = form.fields as Array<{
		id: string;
		label: string;
		[key: string]: unknown;
	}>;

	// Create CSV headers
	const headers = ["Field", "Response"];

	// Create CSV rows
	const rows = fields.map((field) => {
		const response = submissionData[field.id];
		return [
			field.label,
			response !== undefined && response !== null
				? String(response)
				: "No response",
		];
	});

	// Add submission metadata
	rows.unshift(["Submission ID", submissionId]);
	rows.unshift(["Submitted At", new Date(submittedAt).toLocaleString()]);
	rows.unshift(["Form Title", form.title]);
	if (form.description) {
		rows.unshift(["Form Description", form.description]);
	}

	// Generate CSV content
	const csvContent = [
		headers.join(","),
		...rows.map((row) =>
			row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
		),
	].join("\n");

	// Return CSV file
	const response = new NextResponse(csvContent, {
		headers: {
			"Content-Type": "text/csv",
			"Content-Disposition": `attachment; filename="${form.title.replace(/[^a-zA-Z0-9]/g, "_")}_submission_${submissionId.slice(-8)}.csv"`,
		},
	});

	return response;
}
