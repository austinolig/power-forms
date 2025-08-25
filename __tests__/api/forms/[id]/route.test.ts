import {
	getFormAction,
	updateFormAction,
	deleteFormAction,
} from "@/lib/actions";
import { prisma } from "@/lib/db";
import { FormData } from "@/types/db";

const TEST_FORM_DATA: FormData = { title: "form title", fields: [] };
const NON_EXISTENT_ID = "non-existent-id";

const createTestForm = async () => {
	return await prisma.form.create({ data: TEST_FORM_DATA });
};

describe("Form by ID Actions", () => {
	beforeEach(async () => {
		await prisma.form.deleteMany();
		await prisma.submission.deleteMany();
	});

	afterAll(async () => {
		await prisma.$disconnect();
	});

	describe("getFormAction", () => {
		test("returns form by ID", async () => {
			const form = await createTestForm();
			const result = await getFormAction(form.id);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.id).toBe(form.id);
				expect(result.data.title).toBe(TEST_FORM_DATA.title);
				expect(result.data.fields).toEqual(TEST_FORM_DATA.fields);
			}
		});

		test("returns error for non-existent form", async () => {
			const result = await getFormAction(NON_EXISTENT_ID);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toBe("Form not found");
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

		test("deletes submissions when form is deleted", async () => {
			const form = await createTestForm();
			// Create a submission for the form
			await prisma.submission.create({
				data: { formId: form.id, data: [{ field: "value" }] },
			});

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
});
