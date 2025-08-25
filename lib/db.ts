import { PrismaClient } from "@prisma/client";
import type {
	FormsListResult,
	FormWithSubmissions,
	SubmissionsListResult,
} from "@/types/db";

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function getForm(id: string): Promise<FormWithSubmissions | null> {
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

export async function getForms(
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

export async function getSubmissions(
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
	return { submissions, total, hasMore: offset + limit < total };
}
