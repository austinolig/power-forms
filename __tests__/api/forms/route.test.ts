import { GET, POST } from "@/app/api/forms/route";
import { prisma } from "@/lib/db";
import { NextRequest } from "next/server";
import { FormData, FormsListResult } from "@/types/db";
import { ResponseData } from "@/types/api";
import { Form } from "@prisma/client";

const TEST_FORM_DATA: FormData = { title: "form title", fields: [] };

describe("Forms API", () => {
  beforeEach(async () => {
    await prisma.form.deleteMany();
    await prisma.submission.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("GET /api/forms", () => {
    test("returns paginated forms (200)", async () => {
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

    test("returns forms with limit and offset (200)", async () => {
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

    test("returns error for invalid offset (400)", async () => {
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
  });

  describe("POST /api/forms", () => {
    test("creates a new form (201)", async () => {
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

    test("returns error if required fields are not provided (400)", async () => {
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
  });
});
