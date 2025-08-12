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
import { CreateFormData } from "@/types/db";

const TEST_FORM_DATA: CreateFormData = { title: "form title", fields: [] };
const TEST_SUBMISSION_DATA = { field: "response" };
const NON_EXISTENT_ID = "non-existent-id";

const useFormId = async () => {
  const form = await createForm(TEST_FORM_DATA);
  return form.id;
};

describe("Database Operations", () => {
  beforeEach(async () => {
    await prisma.form.deleteMany();
    await prisma.submission.deleteMany();
  });

  afterAll(async () => {
    prisma.$disconnect();
  });

  describe("createForm", () => {
    test("should create a form successfully", async () => {
      const result = await createForm(TEST_FORM_DATA);

      expect(result.id).toBeDefined();
      expect(result.title).toBe(TEST_FORM_DATA.title);
      expect(result.fields).toEqual(TEST_FORM_DATA.fields);
    });

    test("should throw error when creating form with missing title", async () => {
      await expect(
        createForm({} as unknown as CreateFormData)
      ).rejects.toThrow();
    });
  });

  describe("getForm", () => {
    test("should return a form with submissions successfully when form exists", async () => {
      const formId = await useFormId();
      const result = await getForm(formId);

      expect(result).not.toBeNull();
      expect(result!.id).toBe(formId);
      expect(result!.title).toBe(TEST_FORM_DATA.title);
      expect(result!.submissions).toEqual([]);
    });

    test("should return null for non-existent form ID", async () => {
      const result = await getForm(NON_EXISTENT_ID);

      expect(result).toBeNull();
    });
  });

  describe("getForms", () => {
    test("should return empty list when no forms exist", async () => {
      const result = await getForms();

      expect(result.forms).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.hasMore).toBe(false);
    });

    test("should return forms with pagination", async () => {
      await prisma.form.createMany({
        data: [TEST_FORM_DATA, TEST_FORM_DATA, TEST_FORM_DATA],
      });
      const result = await getForms(2, 0);

      expect(result.forms).toHaveLength(2);
      expect(result.total).toBe(3);
      expect(result.hasMore).toBe(true);
    });

    test("should return correct pagination info for second page", async () => {
      await prisma.form.createMany({
        data: [TEST_FORM_DATA, TEST_FORM_DATA, TEST_FORM_DATA],
      });
      const result = await getForms(2, 2);

      expect(result.forms).toHaveLength(1);
      expect(result.total).toBe(3);
      expect(result.hasMore).toBe(false);
    });

    test("should include submission count", async () => {
      const formId = await useFormId();
      await createSubmission(formId, TEST_SUBMISSION_DATA);
      const result = await getForms();

      expect(result.forms[0]._count?.submissions).toBe(1);
    });
  });

  describe("updateForm", () => {
    test("should update form successfully", async () => {
      const formId = await useFormId();
      const updateData = { title: "Updated Form" };
      const result = await updateForm(formId, updateData);

      expect(result.title).toBe(updateData.title);
    });

    test("should throw error for non-existent form ID", async () => {
      await expect(
        updateForm(NON_EXISTENT_ID, { title: "Updated Form" })
      ).rejects.toThrow();
    });
  });

  describe("deleteForm", () => {
    test("should delete form successfully", async () => {
      const formId = await useFormId();
      const result = await deleteForm(formId);

      expect(result.id).toBe(formId);
    });

    test("should throw error for non-existent form ID", async () => {
      await expect(deleteForm(NON_EXISTENT_ID)).rejects.toThrow();
    });
  });

  describe("createSubmission", () => {
    test("should create submission successfully", async () => {
      const formId = await useFormId();
      const result = await createSubmission(formId, TEST_SUBMISSION_DATA);

      expect(result.formId).toBe(formId);
      expect(result.data).toEqual(TEST_SUBMISSION_DATA);
    });

    test("should throw error for non-existent form ID", async () => {
      await expect(
        createSubmission(NON_EXISTENT_ID, TEST_SUBMISSION_DATA)
      ).rejects.toThrow();
    });
  });

  describe("getSubmissions", () => {
    test("should return empty list when no submissions exist", async () => {
      const formId = await useFormId();
      const result = await getSubmissions(formId);

      expect(result.submissions).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.hasMore).toBe(false);
    });

    test("should return submissions with pagination", async () => {
      const formId = await useFormId();
      const submissionInput = { formId, data: TEST_SUBMISSION_DATA };
      await prisma.submission.createMany({
        data: [submissionInput, submissionInput, submissionInput],
      });
      const result = await getSubmissions(formId, 2, 0);

      expect(result.submissions).toHaveLength(2);
      expect(result.total).toBe(3);
      expect(result.hasMore).toBe(true);
    });

    test("should return correct pagination info for second page", async () => {
      const formId = await useFormId();
      const submissionInput = { formId, data: TEST_SUBMISSION_DATA };
      await prisma.submission.createMany({
        data: [submissionInput, submissionInput, submissionInput],
      });
      const result = await getSubmissions(formId, 2, 2);

      expect(result.submissions).toHaveLength(1);
      expect(result.total).toBe(3);
      expect(result.hasMore).toBe(false);
    });

    test("should return empty list for non-existent form ID", async () => {
      const result = await getSubmissions(NON_EXISTENT_ID);

      expect(result.submissions).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.hasMore).toBe(false);
    });
  });
});
