import { GET, PUT, DELETE } from "@/app/api/forms/[id]/route";
import { prisma } from "@/lib/db";
import { NextRequest } from "next/server";
import { FormData } from "@/types/db";
import { ResponseData } from "@/types/api";
import { Form } from "@prisma/client";

const TEST_FORM_DATA: FormData = { title: "form title", fields: [] };
const NON_EXISTENT_ID = "non-existent-id";

const createTestForm = async () => {
  return await prisma.form.create({ data: TEST_FORM_DATA });
};

const createContext = (id: string) => ({
  params: Promise.resolve({ id }),
});

describe("Form by ID API", () => {
  beforeEach(async () => {
    await prisma.form.deleteMany();
    await prisma.submission.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("GET /api/forms/[id]", () => {
    test("returns form by ID (200)", async () => {
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

    test("returns error for non-existent form (404)", async () => {
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
  });

  describe("PUT /api/forms/[id]", () => {
    test("updates form by ID (200)", async () => {
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

    test("returns error for updating non-existent form (404)", async () => {
      jest.spyOn(console, "error").mockImplementationOnce(() => {});

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
  });

  describe("DELETE /api/forms/[id]", () => {
    test("deletes form by ID (200)", async () => {
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

    test("returns error for deleting non-existent form (404)", async () => {
      jest.spyOn(console, "error").mockImplementationOnce(() => {});
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

    test("deletes submissions when form is deleted (200)", async () => {
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
