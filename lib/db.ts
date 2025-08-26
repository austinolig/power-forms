import { PrismaClient, type Form, type Submission } from "@prisma/client";
import type {
	FormsListResult,
	FormWithSubmissions,
	SubmissionsListResult,
	FormData,
	PartialFormData,
	SubmissionData,
} from "@/types/db";

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function getFormWithSubmissions(
	id: string
): Promise<FormWithSubmissions | null> {
	return await prisma.form.findUnique({
		where: { id },
		include: {
			submissions: {
				orderBy: { submittedAt: "desc" },
				take: 10,
			},
		},
	});
}

export async function getFormsWithPagination(
	limit = 10,
	offset = 0
): Promise<FormsListResult> {
	const [forms, total] = await Promise.all([
		prisma.form.findMany({
			orderBy: { createdAt: "desc" },
			take: limit,
			skip: offset,
			select: {
				id: true,
				title: true,
				description: true,
				createdAt: true,
				updatedAt: true,
				_count: { select: { submissions: true } },
			},
		}),
		prisma.form.count(),
	]);
	return { forms, total, hasMore: offset + limit < total };
}

export async function getSubmissionsWithPagination(
	formId: string,
	limit = 50,
	offset = 0
): Promise<SubmissionsListResult> {
	const [submissions, total] = await Promise.all([
		prisma.submission.findMany({
			where: { formId },
			orderBy: { submittedAt: "desc" },
			take: limit,
			skip: offset,
		}),
		prisma.submission.count({ where: { formId } }),
	]);

	return {
		submissions,
		total,
		hasMore: offset + limit < total,
	};
}

export async function createForm(data: FormData): Promise<Form> {
	return await prisma.form.create({ data });
}

export async function updateForm(
	id: string,
	data: PartialFormData
): Promise<Form> {
	return await prisma.form.update({ where: { id }, data });
}

export async function deleteForm(id: string): Promise<Form> {
	return await prisma.form.delete({ where: { id } });
}

export async function createSubmission(
	formId: string,
	data: SubmissionData
): Promise<Submission> {
	return await prisma.submission.create({ data: { formId, data } });
}
