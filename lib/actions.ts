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
import type { ResponseData } from "@/types/actions";
import { Prisma, Form, Submission } from "@prisma/client";
import { successResponse, errorResponse } from "./utils";

export async function getFormsAction(
	limit = 10,
	offset = 0
): Promise<ResponseData<FormsListResult>> {
	if (limit < 1 || offset < 0) {
		return errorResponse("Invalid limit or offset");
	}

	try {
		const result = await getForms(limit, offset);
		return successResponse(result);
	} catch (error) {
		console.error("Forms action GET error:", error);
		return errorResponse("Internal server error");
	}
}

export async function createFormAction(
	data: FormData
): Promise<ResponseData<Form>> {
	if (!data.title || !data.fields) {
		return errorResponse("Title and fields are required");
	}

	try {
		const result = await createForm(data);
		return successResponse(result);
	} catch (error) {
		console.error("Forms action POST error:", error);

		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			return errorResponse("Database error");
		}

		return errorResponse("Internal server error");
	}
}

export async function getFormAction(
	id: string
): Promise<ResponseData<Form & { submissions: Submission[] }>> {
	if (!id) {
		return errorResponse("Form ID is required");
	}

	try {
		const result = await getForm(id);

		if (!result) {
			return errorResponse("Form not found");
		}

		return successResponse(result);
	} catch (error) {
		console.error("Form action GET error:", error);

		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			return errorResponse("Database error");
		}

		return errorResponse("Internal server error");
	}
}

export async function updateFormAction(
	id: string,
	data: PartialFormData
): Promise<ResponseData<Form>> {
	if (!id) {
		return errorResponse("Form ID is required");
	}

	if (data.title && data.title.length < 1) {
		return errorResponse("Title must be at least 1 character");
	}

	try {
		const result = await updateForm(id, data);
		return successResponse(result);
	} catch (error) {
		console.error("Form action PUT error:", error);

		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			switch (error.code) {
				case "P2025":
					return errorResponse("Form not found");
				default:
					return errorResponse("Database error");
			}
		}

		return errorResponse("Internal server error");
	}
}

export async function deleteFormAction(
	id: string
): Promise<ResponseData<Form>> {
	if (!id) {
		return errorResponse("Form ID is required");
	}

	try {
		const result = await deleteForm(id);
		return successResponse(result);
	} catch (error) {
		console.error("Form action DELETE error:", error);

		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			switch (error.code) {
				case "P2025":
					return errorResponse("Form not found");
				default:
					return errorResponse("Database error");
			}
		}

		return errorResponse("Internal server error");
	}
}

export async function getSubmissionsAction(
	formId: string,
	limit = 50,
	offset = 0
): Promise<ResponseData<SubmissionsListResult>> {
	if (!formId) {
		return errorResponse("Form ID is required");
	}

	if (limit < 1 || offset < 0) {
		return errorResponse("Invalid limit or offset");
	}

	try {
		const result = await getSubmissions(formId, limit, offset);
		return successResponse(result);
	} catch (error) {
		console.error("Submissions action GET error:", error);
		return errorResponse("Internal server error");
	}
}

export async function createSubmissionAction(
	formId: string,
	data: SubmissionData
): Promise<ResponseData<Submission>> {
	if (!formId || !data) {
		return errorResponse("Form ID and data are required");
	}

	try {
		const result = await createSubmission(formId, data);
		return successResponse(result);
	} catch (error) {
		console.error("Submissions action POST error:", error);

		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			switch (error.code) {
				case "P2003":
					return errorResponse("Related form not found");
				default:
					return errorResponse("Database error");
			}
		}

		return errorResponse("Internal server error");
	}
}
