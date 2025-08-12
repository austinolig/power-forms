import { GET, PUT, DELETE } from "@/app/api/forms/[id]/route";
import { prisma } from "@/lib/db";
import { NextRequest } from "next/server";
import { CreateFormData } from "@/types/db";
import { ResponseData } from "@/types/api";
import { Form } from "@prisma/client";

const TEST_FORM_DATA: CreateFormData = { title: "form title", fields: [] };
const NON_EXISTENT_ID = "non-existent-id";

const createTestForm = async () => {
  return await prisma.form.create({ data: TEST_FORM_DATA });
};

const createContext = (id: string) => ({
  params: Promise.resolve({ id }),
});

describe("Forms [id] API Route", () => {
  beforeEach(async () => {
    await prisma.form.deleteMany();
    await prisma.submission.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("GET /api/forms/[id]", () => {
    test("should return form successfully (200 status)", async () => {
      const form = await createTestForm();
      const request = new NextRequest(
        `http://localhost:3000/api/forms/${form.id}`
      );
      const response = await GET(request, createContext(form.id));
      const result: ResponseData<Form> = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe(form.id);
        expect(result.data.title).toBe(TEST_FORM_DATA.title);
        expect(result.data.fields).toEqual(TEST_FORM_DATA.fields);
      }
    });

    test("should return 404 for non-existent form", async () => {
      const request = new NextRequest(
        `http://localhost:3000/api/forms/${NON_EXISTENT_ID}`
      );
      const response = await GET(request, createContext(NON_EXISTENT_ID));
      const result: ResponseData<never> = await response.json();

      expect(response.status).toBe(404);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Form not found");
      }
    });

    test("should handle database error (500 status)", async () => {
      jest.spyOn(console, "error").mockImplementationOnce(() => {});
      jest
        .spyOn(prisma.form, "findUnique")
        .mockRejectedValueOnce(new Error("Database error"));

      const request = new NextRequest(
        `http://localhost:3000/api/forms/test-id`
      );
      const response = await GET(request, createContext("test-id"));
      const result: ResponseData<never> = await response.json();

      expect(response.status).toBe(500);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Internal server error");
      }
    });
  });

  describe("PUT /api/forms/[id]", () => {
    test("should update form successfully (200 status)", async () => {
      const form = await createTestForm();
      const updateData = { title: "Updated Form" };
      const request = new NextRequest(
        `http://localhost:3000/api/forms/${form.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        }
      );

      const response = await PUT(request, createContext(form.id));
      const result: ResponseData<Form> = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe(updateData.title);
        expect(result.data.id).toBe(form.id);
      }
    });

    test("should return 404 for non-existent form (P2025)", async () => {
      const updateData = { title: "Updated Form" };
      const request = new NextRequest(
        `http://localhost:3000/api/forms/${NON_EXISTENT_ID}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        }
      );

      const response = await PUT(request, createContext(NON_EXISTENT_ID));
      const result: ResponseData<never> = await response.json();

      expect(response.status).toBe(404);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Form not found");
      }
    });

    test("should not validate empty title (passes because empty string is falsy)", async () => {
      const form = await createTestForm();
      const updateData = { title: "" };
      const request = new NextRequest(
        `http://localhost:3000/api/forms/${form.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        }
      );

      const response = await PUT(request, createContext(form.id));
      const result: ResponseData<Form> = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe("");
      }
    });

    test("should handle malformed JSON (500 status for now)", async () => {
      const form = await createTestForm();
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const request = new NextRequest(
        `http://localhost:3000/api/forms/${form.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: "{ invalid json",
        }
      );

      const response = await PUT(request, createContext(form.id));
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
        .spyOn(prisma.form, "update")
        .mockRejectedValueOnce(new Error("Database error"));

      const updateData = { title: "Updated Form" };
      const request = new NextRequest(
        `http://localhost:3000/api/forms/${form.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        }
      );

      const response = await PUT(request, createContext(form.id));
      const result: ResponseData<never> = await response.json();

      expect(response.status).toBe(500);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Internal server error");
      }
    });
  });

  describe("DELETE /api/forms/[id]", () => {
    test("should delete form successfully (200 status)", async () => {
      const form = await createTestForm();
      const request = new NextRequest(
        `http://localhost:3000/api/forms/${form.id}`
      );

      const response = await DELETE(request, createContext(form.id));
      const result: ResponseData<Form> = await response.json();

      expect(response.status).toBe(200);
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

    test("should return 404 for non-existent form (P2025)", async () => {
      const request = new NextRequest(
        `http://localhost:3000/api/forms/${NON_EXISTENT_ID}`
      );

      const response = await DELETE(request, createContext(NON_EXISTENT_ID));
      const result: ResponseData<never> = await response.json();

      expect(response.status).toBe(404);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Form not found");
      }
    });

    test("should handle database error (500 status)", async () => {
      const form = await createTestForm();
      jest.spyOn(console, "error").mockImplementationOnce(() => {});
      jest
        .spyOn(prisma.form, "delete")
        .mockRejectedValueOnce(new Error("Database error"));

      const request = new NextRequest(
        `http://localhost:3000/api/forms/${form.id}`
      );

      const response = await DELETE(request, createContext(form.id));
      const result: ResponseData<never> = await response.json();

      expect(response.status).toBe(500);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Internal server error");
      }
    });

    test("should verify cascade deletion of submissions", async () => {
      const form = await createTestForm();
      // Create a submission for the form
      await prisma.submission.create({
        data: { formId: form.id, data: { field: "value" } },
      });

      // Verify submission exists
      const submissionsBefore = await prisma.submission.findMany({
        where: { formId: form.id },
      });
      expect(submissionsBefore).toHaveLength(1);

      const request = new NextRequest(
        `http://localhost:3000/api/forms/${form.id}`
      );
      const response = await DELETE(request, createContext(form.id));

      expect(response.status).toBe(200);

      // Verify submissions are cascade deleted
      const submissionsAfter = await prisma.submission.findMany({
        where: { formId: form.id },
      });
      expect(submissionsAfter).toHaveLength(0);
    });
  });
});
