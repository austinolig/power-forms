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

			expect(result.forms).toHaveLength(0);
			expect(result.total).toBe(0);
			expect(result.hasMore).toBe(false);
		});

		test("returns forms with limit and offset", async () => {
			await prisma.form.createMany({
				data: [TEST_FORM_DATA, TEST_FORM_DATA, TEST_FORM_DATA],
			});

			const result = await getFormsAction(1, 1);

			expect(result.forms).toHaveLength(1);
			expect(result.total).toBe(3);
			expect(result.hasMore).toBe(true);
		});

		test("throws error for invalid offset", async () => {
			await expect(getFormsAction(10, -1)).rejects.toThrow(
				"Invalid limit or offset"
			);
		});
	});

	describe("createFormAction", () => {
		test("creates a new form", async () => {
			const result = await createFormAction(TEST_FORM_DATA);

			expect(result).toHaveProperty("id");
			expect(result.title).toBe(TEST_FORM_DATA.title);
			expect(result.fields).toEqual(TEST_FORM_DATA.fields);
		});

		test("throws error if required fields are not provided", async () => {
			await expect(createFormAction({} as FormData)).rejects.toThrow(
				"Title and fields are required"
			);
		});
	});
});
