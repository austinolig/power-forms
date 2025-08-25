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

			expect(result.submissions).toHaveLength(1);
			expect(result.total).toBe(1);
			expect(result.hasMore).toBe(false);
		});

		test("returns submissions for formId with limit and offset", async () => {
			const form = await createTestForm();
			await createTestSubmission(form.id);
			await createTestSubmission(form.id);

			const result = await getSubmissionsAction(form.id, 1, 0);

			expect(result.submissions).toHaveLength(1);
			expect(result.total).toBe(2);
			expect(result.hasMore).toBe(true);
		});

		test("returns empty list for non-existent formId", async () => {
			const result = await getSubmissionsAction(NON_EXISTENT_ID);

			expect(result.submissions).toEqual([]);
			expect(result.total).toBe(0);
			expect(result.hasMore).toBe(false);
		});

		test("returns correct hasMore=false on last page of pagination", async () => {
			const form = await createTestForm();
			await createTestSubmission(form.id);
			await createTestSubmission(form.id);
			await createTestSubmission(form.id);

			const result = await getSubmissionsAction(form.id, 2, 2);

			expect(result.submissions).toHaveLength(1);
			expect(result.total).toBe(3);
			expect(result.hasMore).toBe(false);
		});

		test("throws error if formId is not provided", async () => {
			await expect(getSubmissionsAction("")).rejects.toThrow(
				"Form ID is required"
			);
		});
	});

	describe("createSubmissionAction", () => {
		test("creates a new submission", async () => {
			const form = await createTestForm();

			const result = await createSubmissionAction(
				form.id,
				TEST_SUBMISSION_DATA
			);

			expect(result.formId).toBe(form.id);
			expect(result.data).toEqual(TEST_SUBMISSION_DATA);
			expect(result.id).toBeDefined();
		});

		test("throws error if form does not exist", async () => {
			jest.spyOn(console, "error").mockImplementationOnce(() => {});

			await expect(
				createSubmissionAction(NON_EXISTENT_ID, TEST_SUBMISSION_DATA)
			).rejects.toThrow("Related form not found");
		});

		test("throws error if formId is not provided", async () => {
			await expect(
				createSubmissionAction("", TEST_SUBMISSION_DATA)
			).rejects.toThrow("Form ID and data are required");
		});

		test("throws error if data is not provided", async () => {
			const form = await createTestForm();
			await expect(
				createSubmissionAction(form.id, null as any)
			).rejects.toThrow("Form ID and data are required");
		});
	});
});
