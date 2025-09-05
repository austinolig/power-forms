"use server";

import { createSubmission } from "../db";
import type { SubmissionData } from "@/types/db";
import type { ResponseData } from "@/types/actions";
import { Prisma, type Submission } from "@prisma/client";
import { successResponse, errorResponse } from "../utils";
import { revalidatePath } from "next/cache";
import { generateSchema } from "../validation";
import type { Field } from "@/types/field";

export async function createSubmissionAction(
	formId: string,
	data: SubmissionData,
	fields?: Field[]
): Promise<ResponseData<Submission>> {
	if (!formId || !data) {
		return errorResponse("Form ID and data are required");
	}

	if (fields) {
		const formSchema = generateSchema(fields);
		const result = formSchema.safeParse(data);
		if (!result.success) {
			console.error("Server validation failed:", result.error);
			return errorResponse("Validation failed");
		}
		console.log("Server validation successful");
	}

	try {
		const result = await createSubmission(formId, data);
		revalidatePath("/");
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
