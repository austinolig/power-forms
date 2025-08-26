"use server";

import { prisma } from "./db";
import type { FormData, PartialFormData, SubmissionData } from "@/types/db";
import type { ResponseData } from "@/types/actions";
import { Prisma, type Form, type Submission } from "@prisma/client";
import { successResponse, errorResponse } from "./utils";

export async function createFormAction(
	data: FormData
): Promise<ResponseData<Form>> {
	if (!data.title || !data.fields) {
		return errorResponse("Title and fields are required");
	}

	try {
		const result = await prisma.form.create({ data });
		return successResponse(result);
	} catch (error) {
		console.error("Forms action POST error:", error);

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

	if (data.title !== undefined && data.title.length < 1) {
		return errorResponse("Title must be at least 1 character");
	}

	try {
		const result = await prisma.form.update({ where: { id }, data });
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
		const result = await prisma.form.delete({ where: { id } });
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

export async function createSubmissionAction(
	formId: string,
	data: SubmissionData
): Promise<ResponseData<Submission>> {
	if (!formId || !data) {
		return errorResponse("Form ID and data are required");
	}

	try {
		const result = await prisma.submission.create({ data: { formId, data } });
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
