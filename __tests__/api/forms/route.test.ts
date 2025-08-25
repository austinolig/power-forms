import { getFormsAction, createFormAction } from "@/lib/actions";
import { prisma } from "@/lib/db";
import { FormData } from "@/types/db";

const TEST_FORM_DATA: FormData = { title: "form title", fields: [] };

describe("Forms Actions", () => {
	beforeEach(async () => {
		await prisma.form.deleteMany();
		await prisma.submission.deleteMany();
	});

	afterAll(async () => {
		await prisma.$disconnect();
	});

	describe("getFormsAction", () => {
		test("returns paginated forms", async () => {
			const result = await getFormsAction();

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.forms).toHaveLength(0);
				expect(result.data.total).toBe(0);
				expect(result.data.hasMore).toBe(false);
			}
		});

		test("returns forms with limit and offset", async () => {
			await prisma.form.createMany({
				data: [TEST_FORM_DATA, TEST_FORM_DATA, TEST_FORM_DATA],
			});

			const result = await getFormsAction(1, 1);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.forms).toHaveLength(1);
				expect(result.data.total).toBe(3);
				expect(result.data.hasMore).toBe(true);
			}
		});

		test("returns error for invalid offset", async () => {
			const result = await getFormsAction(10, -1);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toBe("Invalid limit or offset");
			}
		});
	});

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
});
