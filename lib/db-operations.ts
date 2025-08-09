import { prisma } from "./db";
import { Prisma } from "@prisma/client";
import {
  CreateFormData,
  UpdateFormData,
  FormsListResult,
  SubmissionsListResult,
} from "@/types/db";

export async function createForm(data: CreateFormData) {
  return prisma.form.create({ data });
}

export async function getForm(id: string) {
  return prisma.form.findUnique({
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

export async function updateForm(id: string, data: UpdateFormData) {
  return prisma.form.update({ where: { id }, data });
}

export async function deleteForm(id: string) {
  return prisma.form.delete({ where: { id } });
}

export async function createSubmission(
  formId: string,
  data: Prisma.InputJsonValue
) {
  return prisma.submission.create({ data: { formId, data } });
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
