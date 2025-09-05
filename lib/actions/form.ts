"use server";

import { createForm, updateForm, deleteForm } from "../db";
import type { FormData, PartialFormData } from "@/types/db";
import type { ResponseData } from "@/types/actions";
import { Prisma, type Form } from "@prisma/client";
import { successResponse, errorResponse } from "../utils";
import { revalidatePath } from "next/cache";

export async function createFormAction(
	data: FormData
): Promise<ResponseData<Form>> {
	if (!data.title || !data.fields) {
		return errorResponse("Title and fields are required");
	}

	try {
		const result = await createForm(data);
		revalidatePath("/");
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
		const result = await updateForm(id, data);
		revalidatePath("/");
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
		revalidatePath("/");
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
