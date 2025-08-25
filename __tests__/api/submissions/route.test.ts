import { getSubmissionsAction, createSubmissionAction } from "@/lib/actions";
import { prisma } from "@/lib/db";
import { FormData } from "@/types/db";

const TEST_FORM_DATA: FormData = { title: "form title", fields: [] };
const TEST_SUBMISSION_DATA = [{ field: "response" }];
const NON_EXISTENT_ID = "non-existent-id";

const createTestForm = async () => {
	return await prisma.form.create({ data: TEST_FORM_DATA });
};

const createTestSubmission = async (formId: string) => {
	return await prisma.submission.create({
		data: { formId, data: TEST_SUBMISSION_DATA },
	});
};

describe("Submissions Actions", () => {
	beforeEach(async () => {
		await prisma.form.deleteMany();
		await prisma.submission.deleteMany();
	});

	afterAll(async () => {
		await prisma.$disconnect();
	});

	describe("getSubmissionsAction", () => {
		test("returns paginated submissions", async () => {
			const form = await createTestForm();
			await createTestSubmission(form.id);

			const result = await getSubmissionsAction(form.id, 1, 0);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.submissions).toHaveLength(1);
				expect(result.data.total).toBe(1);
				expect(result.data.hasMore).toBe(false);
			}
		});

		test("returns submissions for formId with limit and offset", async () => {
			const form = await createTestForm();
			await createTestSubmission(form.id);
			await createTestSubmission(form.id);

			const result = await getSubmissionsAction(form.id, 1, 0);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.submissions).toHaveLength(1);
				expect(result.data.total).toBe(2);
				expect(result.data.hasMore).toBe(true);
			}
		});

		test("returns empty list for non-existent formId", async () => {
			const result = await getSubmissionsAction(NON_EXISTENT_ID);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.submissions).toEqual([]);
				expect(result.data.total).toBe(0);
				expect(result.data.hasMore).toBe(false);
			}
		});

		test("returns correct hasMore=false on last page of pagination", async () => {
			const form = await createTestForm();
			await createTestSubmission(form.id);
			await createTestSubmission(form.id);
			await createTestSubmission(form.id);

			const result = await getSubmissionsAction(form.id, 2, 2);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.submissions).toHaveLength(1);
				expect(result.data.total).toBe(3);
				expect(result.data.hasMore).toBe(false);
			}
		});

		test("returns error if formId is not provided", async () => {
			const result = await getSubmissionsAction("");
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toBe("Form ID is required");
			}
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
			const result = await createSubmissionAction(form.id, null as any);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toBe("Form ID and data are required");
			}
		});
	});
});
