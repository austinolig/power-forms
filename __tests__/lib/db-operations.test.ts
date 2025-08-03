import {
  createForm,
  getForm,
  getForms,
  updateForm,
  deleteForm,
  createSubmission,
  getSubmissions,
} from "@/lib/db-operations";
import { prisma } from "@/lib/database";

const TEST_FORM_DATA = {
  title: "Test Form",
  description: "A test form for unit testing",
  fields: [
    {
      id: "field1",
      type: "text",
      label: "Name",
      required: true,
    },
    {
      id: "field2",
      type: "email",
      label: "Email",
      required: true,
    },
  ],
  settings: {
    color: "#0000ff",
    submitLimit: 100,
  },
};

describe("Database Operations", () => {
  let testFormId: string;

  beforeEach(async () => {
    await prisma.submission.deleteMany();
    await prisma.form.deleteMany();
  });

  afterAll(async () => {
    await prisma.submission.deleteMany();
    await prisma.form.deleteMany();
    await prisma.$disconnect();
  });

  describe("Form CRUD Operations", () => {
    test("should create a form successfully", async () => {
      const result = await createForm(TEST_FORM_DATA);

      expect(result.success).toBe(true);
      expect(result.data).toMatchObject({
        title: TEST_FORM_DATA.title,
        description: TEST_FORM_DATA.description,
        fields: TEST_FORM_DATA.fields,
        settings: TEST_FORM_DATA.settings,
      });
      expect(result.data?.id).toBeDefined();

      testFormId = result.data!.id;
    });

    test("should get a form by ID", async () => {
      const createResult = await createForm(TEST_FORM_DATA);
      const formId = createResult.data!.id;

      const result = await getForm(formId);

      expect(result.success).toBe(true);
      expect(result.data).toMatchObject({
        id: formId,
        title: TEST_FORM_DATA.title,
        description: TEST_FORM_DATA.description,
        fields: TEST_FORM_DATA.fields,
        settings: TEST_FORM_DATA.settings,
      });
      expect(result.data?.submissions).toBeDefined();
    });

    test("should return error for non-existent form", async () => {
      const result = await getForm("non-existent-id");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Form not found");
    });

    test("should get all forms with pagination", async () => {
      await createForm({ ...TEST_FORM_DATA, title: "Form 1" });
      await createForm({ ...TEST_FORM_DATA, title: "Form 2" });
      await createForm({ ...TEST_FORM_DATA, title: "Form 3" });

      const result = await getForms(2, 0);

      expect(result.success).toBe(true);
      expect(result.data?.forms).toHaveLength(2);
      expect(result.data?.total).toBe(3);
      expect(result.data?.hasMore).toBe(true);
      expect(result.data?.forms[0]._count.submissions).toBe(0);
    });

    test("should update a form", async () => {
      const createResult = await createForm(TEST_FORM_DATA);
      const formId = createResult.data!.id;

      const updateData = {
        title: "Updated Form Title",
        description: "Updated description",
      };

      const result = await updateForm(formId, updateData);

      expect(result.success).toBe(true);
      expect(result.data).toMatchObject({
        id: formId,
        title: updateData.title,
        description: updateData.description,
        fields: TEST_FORM_DATA.fields,
        settings: TEST_FORM_DATA.settings,
      });
    });

    test("should delete a form", async () => {
      const createResult = await createForm(TEST_FORM_DATA);
      const formId = createResult.data!.id;

      const deleteResult = await deleteForm(formId);
      expect(deleteResult.success).toBe(true);

      const getResult = await getForm(formId);
      expect(getResult.success).toBe(false);
      expect(getResult.error).toBe("Form not found");
    });
  });

  describe("Submission Operations", () => {
    beforeEach(async () => {
      const createResult = await createForm(TEST_FORM_DATA);
      testFormId = createResult.data!.id;
    });

    test("should create a submission", async () => {
      const submissionData = {
        field1: "John Doe",
        field2: "john@example.com",
      };

      const result = await createSubmission(
        testFormId,
        submissionData,
        "127.0.0.1"
      );

      expect(result.success).toBe(true);
      expect(result.data).toMatchObject({
        formId: testFormId,
        data: submissionData,
        ipAddress: "127.0.0.1",
      });
      expect(result.data?.id).toBeDefined();
      expect(result.data?.submittedAt).toBeDefined();
    });

    test("should get submissions for a form", async () => {
      const submission1 = { field1: "John Doe", field2: "john@example.com" };
      const submission2 = { field1: "Jane Smith", field2: "jane@example.com" };

      await createSubmission(testFormId, submission1);
      await createSubmission(testFormId, submission2);

      const result = await getSubmissions(testFormId, 10, 0);

      expect(result.success).toBe(true);
      expect(result.data?.submissions).toHaveLength(2);
      expect(result.data?.total).toBe(2);
      expect(result.data?.hasMore).toBe(false);

      expect(result.data?.submissions[0].data).toEqual(submission2);
      expect(result.data?.submissions[1].data).toEqual(submission1);
    });

    test("should handle pagination for submissions", async () => {
      for (let i = 0; i < 5; i++) {
        await createSubmission(testFormId, {
          field1: `User ${i}`,
          field2: `user${i}@example.com`,
        });
      }

      const result = await getSubmissions(testFormId, 3, 0);

      expect(result.success).toBe(true);
      expect(result.data?.submissions).toHaveLength(3);
      expect(result.data?.total).toBe(5);
      expect(result.data?.hasMore).toBe(true);
    });
  });
});
