import { GET, POST } from "@/app/api/submissions/route";
import { prisma } from "@/lib/db";
import { NextRequest } from "next/server";
import { CreateFormData, SubmissionsListResult } from "@/types/db";
import { ResponseData } from "@/types/api";
import { Submission } from "@prisma/client";

const TEST_FORM_DATA: CreateFormData = { title: "form title", fields: [] };
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

describe("Submissions API Route", () => {
  beforeEach(async () => {
    await prisma.form.deleteMany();
    await prisma.submission.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("GET /api/submissions", () => {
    test("should return submissions with pagination (200 status)", async () => {
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

    test("should return empty list for non-existent formId (200 status)", async () => {
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

    test("should return 400 for missing formId parameter", async () => {
      const request = new NextRequest("http://localhost:3000/api/submissions");
      const response = await GET(request);
      const result: ResponseData<never> = await response.json();

      expect(response.status).toBe(400);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Form ID is required");
      }
    });

    test("should return 400 for invalid limit parameter", async () => {
      const form = await createTestForm();
      const request = new NextRequest(
        `http://localhost:3000/api/submissions?formId=${form.id}&limit=-1`
      );
      const response = await GET(request);
      const result: ResponseData<never> = await response.json();

      expect(response.status).toBe(400);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Invalid limit or offset");
      }
    });

    test("should return 400 for invalid offset parameter", async () => {
      const form = await createTestForm();
      const request = new NextRequest(
        `http://localhost:3000/api/submissions?formId=${form.id}&offset=-1`
      );
      const response = await GET(request);
      const result: ResponseData<never> = await response.json();

      expect(response.status).toBe(400);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Invalid limit or offset");
      }
    });

    test("should handle database error (500 status)", async () => {
      const form = await createTestForm();
      jest.spyOn(console, "error").mockImplementationOnce(() => {});
      jest
        .spyOn(prisma.submission, "findMany")
        .mockRejectedValueOnce(new Error("Database error"));

      const request = new NextRequest(
        `http://localhost:3000/api/submissions?formId=${form.id}`
      );
      const response = await GET(request);
      const result: ResponseData<never> = await response.json();

      expect(response.status).toBe(500);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Internal server error");
      }
    });

    test("should test pagination boundaries (hasMore logic)", async () => {
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
  });

  describe("POST /api/submissions", () => {
    test("should create submission successfully (201 status)", async () => {
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

    test("should return 404 for non-existent formId (P2003 → Form not found)", async () => {
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
        expect(result.error).toBe("Form not found");
      }
    });

    test("should return 400 for missing formId", async () => {
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

    test("should return 400 for missing data", async () => {
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

    test("should handle malformed JSON (500 status for now)", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const request = new NextRequest("http://localhost:3000/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{ invalid json",
      });

      const response = await POST(request);
      const result: ResponseData<never> = await response.json();

      expect(response.status).toBe(500);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Internal server error");
      }

      consoleErrorSpy.mockRestore();
    });

    test("should handle database error (500 status)", async () => {
      const form = await createTestForm();
      jest.spyOn(console, "error").mockImplementationOnce(() => {});
      jest
        .spyOn(prisma.submission, "create")
        .mockRejectedValueOnce(new Error("Database error"));

      const submissionData = { formId: form.id, data: TEST_SUBMISSION_DATA };
      const request = new NextRequest("http://localhost:3000/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      const response = await POST(request);
      const result: ResponseData<never> = await response.json();

      expect(response.status).toBe(500);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Internal server error");
      }
    });
  });
});
