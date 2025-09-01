import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

interface RouteParams {
	params: Promise<{ formId: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
	const { formId } = await params;

	// Get form with all submissions
	const form = await prisma.form.findUnique({
		where: { id: formId },
		include: {
			submissions: {
				orderBy: { submittedAt: "desc" },
			},
		},
	});

	if (!form) {
		notFound();
	}

	const fields = form.fields as Array<{
		id: string;
		label: string;
		[key: string]: unknown;
	}>;

	// Create CSV headers
	const headers = [
		"Submission ID",
		"Submitted At",
		...fields.map((f) => f.label),
	];

	// Create CSV rows
	const rows = form.submissions.map((submission) => {
		const submissionData = submission.data as Record<string, unknown>;
		const row = [
			submission.id,
			new Date(submission.submittedAt).toISOString(),
			...fields.map((field) => {
				const value = submissionData[field.id];
				return value !== undefined && value !== null ? String(value) : "";
			}),
		];
		return row;
	});

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
			"Content-Disposition": `attachment; filename="${form.title.replace(/[^a-zA-Z0-9]/g, "_")}_responses.csv"`,
		},
	});

	return response;
}
