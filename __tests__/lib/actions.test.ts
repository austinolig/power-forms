import {
	createFormAction,
	updateFormAction,
	deleteFormAction,
	createSubmissionAction,
} from "@/lib/actions";
import { prisma, getForm, getForms, getSubmissions } from "@/lib/db";
import type { FormData, SubmissionData } from "@/types/db";

const TEST_FORM_DATA: FormData = { title: "form title", fields: [] };
const TEST_SUBMISSION_DATA: SubmissionData = { field: "response" };
const NON_EXISTENT_ID = "non-existent-id";

const createTestForm = async () => {
	return await prisma.form.create({ data: TEST_FORM_DATA });
};

const createTestSubmission = async (formId: string) => {
	return await prisma.submission.create({
		data: { formId, data: TEST_SUBMISSION_DATA },
	});
};

describe("Actions", () => {
	beforeEach(async () => {
		await prisma.form.deleteMany();
		await prisma.submission.deleteMany();
	});

	afterAll(async () => {
		await prisma.$disconnect();
	});

	describe("Database Operations", () => {
		describe("getForm", () => {
			test("returns form with submissions", async () => {
				const form = await createTestForm();
				const result = await getForm(form.id);

				expect(result).not.toBeNull();
				expect(result!.id).toBe(form.id);
				expect(result!.title).toBe(TEST_FORM_DATA.title);
				expect(result!.submissions).toEqual([]);
			});

			test("returns null for non-existent form", async () => {
				const result = await getForm(NON_EXISTENT_ID);

				expect(result).toBeNull();
			});
		});

		describe("getForms", () => {
			test("returns paginated forms", async () => {
				const result = await getForms();
				expect(result.forms).toEqual([]);
				expect(result.total).toBe(0);
				expect(result.hasMore).toBe(false);
			});

			test("returns forms with limit and offset", async () => {
				await prisma.form.createMany({
					data: [TEST_FORM_DATA, TEST_FORM_DATA, TEST_FORM_DATA],
				});
				const result = await getForms(1, 0);
				expect(result.forms).toHaveLength(1);
				expect(result.total).toBe(3);
				expect(result.hasMore).toBe(true);
			});
		});

		describe("getSubmissions", () => {
			test("returns paginated submissions", async () => {
				const form = await createTestForm();
				const result = await getSubmissions(form.id);

				expect(result.submissions).toEqual([]);
				expect(result.total).toBe(0);
				expect(result.hasMore).toBe(false);
			});

			test("returns submissions with limit and offset", async () => {
				const form = await createTestForm();
				await prisma.submission.createMany({
					data: [
						{ formId: form.id, data: TEST_SUBMISSION_DATA },
						{ formId: form.id, data: TEST_SUBMISSION_DATA },
						{ formId: form.id, data: TEST_SUBMISSION_DATA },
					],
				});
				const result = await getSubmissions(form.id, 1, 0);
				expect(result.submissions).toHaveLength(1);
				expect(result.total).toBe(3);
				expect(result.hasMore).toBe(true);
			});

			test("returns empty list if form does not exist", async () => {
				const result = await getSubmissions(NON_EXISTENT_ID);

				expect(result.submissions).toEqual([]);
				expect(result.total).toBe(0);
				expect(result.hasMore).toBe(false);
			});
		});
	});

	describe("Server Actions", () => {
		describe("createFormAction", () => {
			test("creates a new form", async () => {
				const result = await createFormAction(TEST_FORM_DATA);

				expect(result.success).toBe(true);
				if (result.success) {
					expect(result.data).toHaveProperty("id");
					expect(result.data.title).toBe(TEST_FORM_DATA.title);
					expect(result.data.fields).toEqual(TEST_FORM_DATA.fields);
				}
			});

			test("returns error if required fields are not provided", async () => {
				const result = await createFormAction({} as FormData);
				expect(result.success).toBe(false);
				if (!result.success) {
					expect(result.error).toBe("Title and fields are required");
				}
			});
		});

		describe("updateFormAction", () => {
			test("updates form by ID", async () => {
				const form = await createTestForm();
				const updateData = { title: "Updated Form" };

				const result = await updateFormAction(form.id, updateData);

				expect(result.success).toBe(true);
				if (result.success) {
					expect(result.data.title).toBe(updateData.title);
					expect(result.data.id).toBe(form.id);
				}
			});

			test("returns error for updating non-existent form", async () => {
				jest.spyOn(console, "error").mockImplementationOnce(() => {});

				const updateData = { title: "Updated Form" };
				const result = await updateFormAction(NON_EXISTENT_ID, updateData);
				expect(result.success).toBe(false);
				if (!result.success) {
					expect(result.error).toBe("Form not found");
				}
			});

			test("returns error if form ID is not provided", async () => {
				const result = await updateFormAction("", { title: "Updated" });
				expect(result.success).toBe(false);
				if (!result.success) {
					expect(result.error).toBe("Form ID is required");
				}
			});

			test("returns error if title is empty", async () => {
				const form = await createTestForm();
				const result = await updateFormAction(form.id, { title: "" });
				expect(result.success).toBe(false);
				if (!result.success) {
					expect(result.error).toBe("Title must be at least 1 character");
				}
			});
		});

		describe("deleteFormAction", () => {
			test("deletes form by ID", async () => {
				const form = await createTestForm();

				const result = await deleteFormAction(form.id);

				expect(result.success).toBe(true);
				if (result.success) {
					expect(result.data.id).toBe(form.id);
				}

				// Verify form is actually deleted
				const deletedForm = await prisma.form.findUnique({
					where: { id: form.id },
				});
				expect(deletedForm).toBeNull();
			});

			test("returns error for deleting non-existent form", async () => {
				jest.spyOn(console, "error").mockImplementationOnce(() => {});
				const result = await deleteFormAction(NON_EXISTENT_ID);
				expect(result.success).toBe(false);
				if (!result.success) {
					expect(result.error).toBe("Form not found");
				}
			});

			test("returns error if form ID is not provided", async () => {
				const result = await deleteFormAction("");
				expect(result.success).toBe(false);
				if (!result.success) {
					expect(result.error).toBe("Form ID is required");
				}
			});

			test("deletes submissions when form is deleted", async () => {
				const form = await createTestForm();
				// Create a submission for the form
				await createTestSubmission(form.id);

				// Verify submission exists
				const submissionsBefore = await prisma.submission.findMany({
					where: { formId: form.id },
				});
				expect(submissionsBefore).toHaveLength(1);

				const result = await deleteFormAction(form.id);
				expect(result.success).toBe(true);

				// Verify submissions are cascade deleted
				const submissionsAfter = await prisma.submission.findMany({
					where: { formId: form.id },
				});
				expect(submissionsAfter).toHaveLength(0);
			});
		});

		describe("createSubmissionAction", () => {
			test("creates a new submission", async () => {
				const form = await createTestForm();

				const result = await createSubmissionAction(
					form.id,
					TEST_SUBMISSION_DATA
				);

				expect(result.success).toBe(true);
				if (result.success) {
					expect(result.data.formId).toBe(form.id);
					expect(result.data.data).toEqual(TEST_SUBMISSION_DATA);
					expect(result.data.id).toBeDefined();
				}
			});

			test("returns error if form does not exist", async () => {
				jest.spyOn(console, "error").mockImplementationOnce(() => {});

				const result = await createSubmissionAction(
					NON_EXISTENT_ID,
					TEST_SUBMISSION_DATA
				);
				expect(result.success).toBe(false);
				if (!result.success) {
					expect(result.error).toBe("Related form not found");
				}
			});

			test("returns error if formId is not provided", async () => {
				const result = await createSubmissionAction("", TEST_SUBMISSION_DATA);
				expect(result.success).toBe(false);
				if (!result.success) {
					expect(result.error).toBe("Form ID and data are required");
				}
			});

			test("returns error if data is not provided", async () => {
				const form = await createTestForm();
				const result = await createSubmissionAction(form.id, "");
				expect(result.success).toBe(false);
				if (!result.success) {
					expect(result.error).toBe("Form ID and data are required");
				}
			});
		});
	});
});
