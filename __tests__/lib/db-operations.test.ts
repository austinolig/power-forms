import { prisma } from "@/lib/db";
import {
  createForm,
  getForm,
  getForms,
  updateForm,
  deleteForm,
  createSubmission,
  getSubmissions,
} from "@/lib/db-operations";
import { FormData, SubmissionData } from "@/types/db";

const TEST_FORM_DATA: FormData = { title: "form title", fields: [] };
const TEST_SUBMISSION_DATA: SubmissionData = [{ field: "response" }];
const NON_EXISTENT_ID = "non-existent-id";

describe("Database Operations", () => {
  beforeEach(async () => {
    await prisma.form.deleteMany();
    await prisma.submission.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("createForm", () => {
    test("creates a form", async () => {
      const result = await createForm(TEST_FORM_DATA);

      expect(result.id).toBeDefined();
      expect(result.title).toBe(TEST_FORM_DATA.title);
      expect(result.fields).toEqual(TEST_FORM_DATA.fields);
    });
  });

  describe("getForm", () => {
    test("returns form with submissions", async () => {
      const form = await createForm(TEST_FORM_DATA);
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

  describe("getForms (list forms API)", () => {
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

  describe("updateForm", () => {
    test("updates a form", async () => {
      const form = await createForm(TEST_FORM_DATA);
      const updateData = { title: "Updated Form" };
      const result = await updateForm(form.id, updateData);

      expect(result.title).toBe(updateData.title);
    });

    test("throws error if form does not exist", async () => {
      await expect(
        updateForm(NON_EXISTENT_ID, { title: "Updated Form" })
      ).rejects.toThrow();
    });
  });

  describe("deleteForm", () => {
    test("deletes a form", async () => {
      const form = await createForm(TEST_FORM_DATA);
      const result = await deleteForm(form.id);

      expect(result.id).toBe(form.id);
    });

    test("throws error if form does not exist", async () => {
      await expect(deleteForm(NON_EXISTENT_ID)).rejects.toThrow();
    });
  });

  describe("createSubmission", () => {
    test("creates a submission", async () => {
      const form = await createForm(TEST_FORM_DATA);
      const result = await createSubmission(form.id, TEST_SUBMISSION_DATA);

      expect(result.formId).toBe(form.id);
      expect(result.data).toEqual(TEST_SUBMISSION_DATA);
    });

    test("throws error if form does not exist", async () => {
      await expect(
        createSubmission(NON_EXISTENT_ID, TEST_SUBMISSION_DATA)
      ).rejects.toThrow();
    });
  });

  describe("getSubmissions", () => {
    test("returns paginated submissions", async () => {
      const form = await createForm(TEST_FORM_DATA);
      const result = await getSubmissions(form.id);

      expect(result.submissions).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.hasMore).toBe(false);
    });

    test("returns submissions with limit and offset", async () => {
      const form = await createForm(TEST_FORM_DATA);
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
