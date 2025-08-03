import { prisma } from "./database";
import type { InputJsonValue } from "@prisma/client/runtime/library";

export type CreateFormData = {
  title: string;
  description?: string;
  fields: InputJsonValue[];
  settings?: InputJsonValue;
};

export type UpdateFormData = Partial<CreateFormData>;

export async function createForm(data: CreateFormData) {
  try {
    const form = await prisma.form.create({
      data,
    });
    return { success: true, data: form };
  } catch (error) {
    console.error("Error creating form:", error);
    return { success: false, error: "Failed to create form" };
  }
}

export async function getForm(id: string) {
  try {
    const form = await prisma.form.findUnique({
      where: { id },
      include: {
        submissions: {
          orderBy: { submittedAt: "desc" },
          take: 10,
        },
      },
    });

    if (!form) {
      return { success: false, error: "Form not found" };
    }

    return { success: true, data: form };
  } catch (error) {
    console.error("Error fetching form:", error);
    return { success: false, error: "Failed to fetch form" };
  }
}

export async function getForms(limit = 10, offset = 0) {
  try {
    const forms = await prisma.form.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
      include: {
        _count: {
          select: { submissions: true },
        },
      },
    });

    const total = await prisma.form.count();

    return {
      success: true,
      data: { forms, total, hasMore: offset + limit < total },
    };
  } catch (error) {
    console.error("Error fetching forms:", error);
    return { success: false, error: "Failed to fetch forms" };
  }
}

export async function updateForm(id: string, data: UpdateFormData) {
  try {
    const form = await prisma.form.update({
      where: { id },
      data,
    });
    return { success: true, data: form };
  } catch (error) {
    console.error("Error updating form:", error);
    return { success: false, error: "Failed to update form" };
  }
}

export async function deleteForm(id: string) {
  try {
    await prisma.form.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting form:", error);
    return { success: false, error: "Failed to delete form" };
  }
}

export async function createSubmission(
  formId: string,
  data: InputJsonValue,
  ipAddress?: string
) {
  try {
    const submission = await prisma.submission.create({
      data: {
        formId,
        data,
        ipAddress,
      },
    });
    return { success: true, data: submission };
  } catch (error) {
    console.error("Error creating submission:", error);
    return { success: false, error: "Failed to create submission" };
  }
}

export async function getSubmissions(formId: string, limit = 50, offset = 0) {
  try {
    const submissions = await prisma.submission.findMany({
      where: { formId },
      orderBy: { submittedAt: "desc" },
      take: limit,
      skip: offset,
    });

    const total = await prisma.submission.count({
      where: { formId },
    });

    return {
      success: true,
      data: { submissions, total, hasMore: offset + limit < total },
    };
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return { success: false, error: "Failed to fetch submissions" };
  }
}
