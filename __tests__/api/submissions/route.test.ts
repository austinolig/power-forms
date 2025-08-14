import { GET, POST } from "@/app/api/submissions/route";
import { prisma } from "@/lib/db";
import { NextRequest } from "next/server";
import { FormData, SubmissionsListResult } from "@/types/db";
import { ResponseData } from "@/types/api";
import { Submission } from "@prisma/client";

const TEST_FORM_DATA: FormData = { title: "form title", fields: [] };
const TEST_SUBMISSION_DATA = { field: "response" };
const NON_EXISTENT_ID = "non-existent-id";

const createTestForm = async () => {
  return await prisma.form.create({ data: TEST_FORM_DATA });
};

const createTestSubmission = async (formId: string) => {
  return await prisma.submission.create({
    data: { formId, data: TEST_SUBMISSION_DATA },
  });
};

describe("Submissions API", () => {
  beforeEach(async () => {
    await prisma.form.deleteMany();
    await prisma.submission.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("GET /api/submissions", () => {
    test("returns paginated submissions (200)", async () => {
      const form = await createTestForm();
      await createTestSubmission(form.id);

      const request = new NextRequest(
        `http://localhost:3000/api/submissions?formId=${form.id}&limit=1&offset=0`
      );
      const response = await GET(request);
      const result: ResponseData<SubmissionsListResult> = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.submissions).toHaveLength(1);
        expect(result.data.total).toBe(1);
        expect(result.data.hasMore).toBe(false);
      }
    });

    test("returns submissions for formId with limit and offset (200)", async () => {
      const form = await createTestForm();
      await createTestSubmission(form.id);
      await createTestSubmission(form.id);

      const request = new NextRequest(
        `http://localhost:3000/api/submissions?formId=${form.id}&limit=1&offset=0`
      );
      const response = await GET(request);
      const result: ResponseData<SubmissionsListResult> = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.submissions).toHaveLength(1);
        expect(result.data.total).toBe(2);
        expect(result.data.hasMore).toBe(true);
      }
    });

    test("returns empty list for non-existent formId (200)", async () => {
      const request = new NextRequest(
        `http://localhost:3000/api/submissions?formId=${NON_EXISTENT_ID}`
      );
      const response = await GET(request);
      const result: ResponseData<SubmissionsListResult> = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.submissions).toEqual([]);
        expect(result.data.total).toBe(0);
        expect(result.data.hasMore).toBe(false);
      }
    });

    test("returns correct hasMore=false on last page of pagination (200)", async () => {
      const form = await createTestForm();
      await createTestSubmission(form.id);
      await createTestSubmission(form.id);
      await createTestSubmission(form.id);

      // Test last page
      const request = new NextRequest(
        `http://localhost:3000/api/submissions?formId=${form.id}&limit=2&offset=2`
      );
      const response = await GET(request);
      const result: ResponseData<SubmissionsListResult> = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.submissions).toHaveLength(1);
        expect(result.data.total).toBe(3);
        expect(result.data.hasMore).toBe(false);
      }
    });

    test("returns error if formId is not provided (400)", async () => {
      const request = new NextRequest("http://localhost:3000/api/submissions");
      const response = await GET(request);
      const result: ResponseData<never> = await response.json();

      expect(response.status).toBe(400);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Form ID is required");
      }
    });
  });

  describe("POST /api/submissions", () => {
    test("creates a new submission (201)", async () => {
      const form = await createTestForm();
      const submissionData = { formId: form.id, data: TEST_SUBMISSION_DATA };

      const request = new NextRequest("http://localhost:3000/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      const response = await POST(request);
      const result: ResponseData<Submission> = await response.json();

      expect(response.status).toBe(201);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.formId).toBe(form.id);
        expect(result.data.data).toEqual(TEST_SUBMISSION_DATA);
        expect(result.data.id).toBeDefined();
      }
    });

    test("returns error if form does not exist (404)", async () => {
      jest.spyOn(console, "error").mockImplementationOnce(() => {});

      const submissionData = {
        formId: NON_EXISTENT_ID,
        data: TEST_SUBMISSION_DATA,
      };

      const request = new NextRequest("http://localhost:3000/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      const response = await POST(request);
      const result: ResponseData<never> = await response.json();

      expect(response.status).toBe(404);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Related form not found");
      }
    });

    test("returns error if formId is not provided (400)", async () => {
      const submissionData = { data: TEST_SUBMISSION_DATA };

      const request = new NextRequest("http://localhost:3000/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      const response = await POST(request);
      const result: ResponseData<never> = await response.json();

      expect(response.status).toBe(400);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Form ID and data are required");
      }
    });

    test("returns error if data is not provided (400)", async () => {
      const form = await createTestForm();
      const submissionData = { formId: form.id };

      const request = new NextRequest("http://localhost:3000/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      const response = await POST(request);
      const result: ResponseData<never> = await response.json();

      expect(response.status).toBe(400);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Form ID and data are required");
      }
    });
  });
});
