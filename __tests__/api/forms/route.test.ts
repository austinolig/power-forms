import { GET, POST } from "@/app/api/forms/route";
import { prisma } from "@/lib/db";
import { NextRequest } from "next/server";
import { CreateFormData, FormsListResult } from "@/types/db";
import { ResponseData } from "@/types/api";
import { Form } from "@prisma/client";

const TEST_FORM_DATA: CreateFormData = { title: "form title", fields: [] };

describe("Forms API Route", () => {
  beforeEach(async () => {
    await prisma.form.deleteMany();
    await prisma.submission.deleteMany();
  });

  afterAll(async () => {
    prisma.$disconnect();
  });

  describe("GET /api/forms", () => {
    test("return forms data with default pagination (200 status)", async () => {
      const request = new NextRequest("http://localhost:3000/api/forms");
      const response = await GET(request);
      const result: ResponseData<FormsListResult> = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.forms).toHaveLength(0);
        expect(result.data.total).toBe(0);
        expect(result.data.hasMore).toBe(false);
      }
    });

    test("return forms data with limit and offset (200 status)", async () => {
      await prisma.form.createMany({
        data: [TEST_FORM_DATA, TEST_FORM_DATA, TEST_FORM_DATA],
      });

      const request = new NextRequest(
        "http://localhost:3000/api/forms?limit=1&offset=1"
      );
      const response = await GET(request);
      const result: ResponseData<FormsListResult> = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.forms).toHaveLength(1);
        expect(result.data.total).toBe(3);
        expect(result.data.hasMore).toBe(true);
      }
    });

    test("return forms data with zero limit defaults to 10 (200 status)", async () => {
      await prisma.form.createMany({
        data: [TEST_FORM_DATA, TEST_FORM_DATA, TEST_FORM_DATA],
      });

      const request = new NextRequest(
        "http://localhost:3000/api/forms?limit=0"
      );
      const response = await GET(request);
      const result: ResponseData<FormsListResult> = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.forms).toHaveLength(3);
        expect(result.data.total).toBe(3);
        expect(result.data.hasMore).toBe(false);
      }
    });

    test("return error for invalid offset parameter (400 status)", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/forms?offset=-1"
      );
      const response = await GET(request);
      const result: ResponseData<never> = await response.json();

      expect(response.status).toBe(400);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Invalid limit or offset");
      }
    });

    test("handle database error (500 status)", async () => {
      jest.spyOn(console, "error").mockImplementationOnce(() => {});
      jest.spyOn(prisma.form, "findMany").mockRejectedValueOnce(new Error());

      const request = new NextRequest("http://localhost:3000/api/forms");

      const response = await GET(request);
      const result: ResponseData<never> = await response.json();

      expect(response.status).toBe(500);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Internal server error");
      }
    });
  });

  describe("POST /api/forms", () => {
    test("create new form successfully (201 status)", async () => {
      const request = new NextRequest("http://localhost:3000/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(TEST_FORM_DATA),
      });

      const response = await POST(request);
      const result: ResponseData<Form> = await response.json();

      expect(response.status).toBe(201);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveProperty("id");
        expect(result.data.title).toBe(TEST_FORM_DATA.title);
        expect(result.data.fields).toEqual(TEST_FORM_DATA.fields);
      }
    });

    test("return error when required fields are missing (400 status)", async () => {
      const request = new NextRequest("http://localhost:3000/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      const result: ResponseData<never> = await response.json();

      expect(response.status).toBe(400);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Title and fields are required");
      }
    });

    test("handle malformed JSON (500 status)", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const request = new NextRequest("http://localhost:3000/api/forms", {
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
  });
});
