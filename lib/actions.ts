"use server";

import {
	createForm,
	getForm,
	getForms,
	updateForm,
	deleteForm,
	createSubmission,
	getSubmissions,
} from "./db-operations";
import type {
	FormData,
	PartialFormData,
	FormsListResult,
	SubmissionsListResult,
	SubmissionData,
} from "@/types/db";
import { Prisma } from "@prisma/client";

/**
 * Server actions that replace API route logic and call into lib/db-operations.ts directly.
 * These mirror the validation and error handling from the original API routes.
 */

export async function getFormsAction(
	limit = 10,
	offset = 0
): Promise<FormsListResult> {
	if (limit < 1 || offset < 0) {
		throw new Error("Invalid limit or offset");
	}

	try {
		return await getForms(limit, offset);
	} catch (error) {
		console.error("Forms action GET error:", error);
		throw new Error("Internal server error");
	}
}

export async function createFormAction(data: FormData) {
	if (!data.title || !data.fields) {
		throw new Error("Title and fields are required");
	}

	try {
		return await createForm(data);
	} catch (error) {
		console.error("Forms action POST error:", error);

		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			throw new Error("Database error");
		}

		throw new Error("Internal server error");
	}
}

export async function getFormAction(id: string) {
	if (!id) {
		throw new Error("Form ID is required");
	}

	try {
		const result = await getForm(id);

		if (!result) {
			throw new Error("Form not found");
		}

		return result;
	} catch (error) {
		console.error("Form action GET error:", error);

		if (error instanceof Error && error.message === "Form not found") {
			throw error;
		}

		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			throw new Error("Database error");
		}

		throw new Error("Internal server error");
	}
}

export async function updateFormAction(id: string, data: PartialFormData) {
	if (!id) {
		throw new Error("Form ID is required");
	}

	if (data.title && data.title.length < 1) {
		throw new Error("Title must be at least 1 character");
	}

	try {
		return await updateForm(id, data);
	} catch (error) {
		console.error("Form action PUT error:", error);

		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			switch (error.code) {
				case "P2025":
					throw new Error("Form not found");
				default:
					throw new Error("Database error");
			}
		}

		throw new Error("Internal server error");
	}
}

export async function deleteFormAction(id: string) {
	if (!id) {
		throw new Error("Form ID is required");
	}

	try {
		return await deleteForm(id);
	} catch (error) {
		console.error("Form action DELETE error:", error);

		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			switch (error.code) {
				case "P2025":
					throw new Error("Form not found");
				default:
					throw new Error("Database error");
			}
		}

		throw new Error("Internal server error");
	}
}

export async function getSubmissionsAction(
	formId: string,
	limit = 50,
	offset = 0
): Promise<SubmissionsListResult> {
	if (!formId) {
		throw new Error("Form ID is required");
	}

	if (limit < 1 || offset < 0) {
		throw new Error("Invalid limit or offset");
	}

	try {
		return await getSubmissions(formId, limit, offset);
	} catch (error) {
		console.error("Submissions action GET error:", error);
		throw new Error("Internal server error");
	}
}

export async function createSubmissionAction(
	formId: string,
	data: SubmissionData
) {
	if (!formId || !data) {
		throw new Error("Form ID and data are required");
	}

	try {
		return await createSubmission(formId, data);
	} catch (error) {
		console.error("Submissions action POST error:", error);

		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			switch (error.code) {
				case "P2003":
					throw new Error("Related form not found");
				default:
					throw new Error("Database error");
			}
		}

		throw new Error("Internal server error");
	}
}
