import { NextRequest } from "next/server";
import { GET, PUT, DELETE } from "@/app/api/forms/[id]/route";
import * as dbOperations from "@/lib/db-operations";

// Mock the db-operations module
jest.mock("@/lib/db-operations");
const mockDbOperations = dbOperations as jest.Mocked<typeof dbOperations>;

// Mock NextRequest
const createMockRequest = (url: string, method: string, body?: any) => {
  const request = {
    url,
    method,
    json: jest.fn().mockResolvedValue(body),
  } as unknown as NextRequest;
  return request;
};

// Mock context with params
const createMockContext = (id: string) => ({
  params: Promise.resolve({ id }),
});

describe("/api/forms/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET", () => {
    it("should return a form successfully", async () => {
      const mockForm = {
        success: true as const,
        data: {
          id: "form-123",
          title: "Test Form",
          description: "Test description",
          fields: [{ type: "text", label: "Name" }],
          settings: {},
          createdAt: new Date(),
          updatedAt: new Date(),
          submissions: [],
        },
      };

      mockDbOperations.getForm.mockResolvedValue(mockForm);

      const request = createMockRequest(
        "http://localhost:3000/api/forms/form-123",
        "GET"
      );
      const context = createMockContext("form-123");
      const response = await GET(request, context);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(mockDbOperations.getForm).toHaveBeenCalledWith("form-123");
      expect(data).toEqual({
        id: "form-123",
        title: "Test Form",
        description: "Test description",
        fields: [{ type: "text", label: "Name" }],
        settings: {},
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        submissions: [],
      });
    });

    it("should return 404 when form not found", async () => {
      mockDbOperations.getForm.mockResolvedValue({
        success: false as const,
        error: "Form not found",
      });

      const request = createMockRequest(
        "http://localhost:3000/api/forms/nonexistent",
        "GET"
      );
      const context = createMockContext("nonexistent");
      const response = await GET(request, context);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ error: "Form not found" });
    });

    it("should return 500 for other database errors", async () => {
      mockDbOperations.getForm.mockResolvedValue({
        success: false as const,
        error: "Database connection failed",
      });

      const request = createMockRequest(
        "http://localhost:3000/api/forms/form-123",
        "GET"
      );
      const context = createMockContext("form-123");
      const response = await GET(request, context);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Database connection failed" });
    });

    it("should handle unexpected errors", async () => {
      mockDbOperations.getForm.mockRejectedValue(new Error("Unexpected error"));

      const request = createMockRequest(
        "http://localhost:3000/api/forms/form-123",
        "GET"
      );
      const context = createMockContext("form-123");
      const response = await GET(request, context);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Internal server error" });
    });
  });

  describe("PUT", () => {
    it("should update a form successfully", async () => {
      const updateData = {
        title: "Updated Form",
        description: "Updated description",
        fields: [{ type: "email", label: "Email" }],
      };

      const mockResult = {
        success: true as const,
        data: {
          id: "form-123",
          title: updateData.title,
          description: updateData.description,
          fields: updateData.fields,
          settings: {},
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      mockDbOperations.updateForm.mockResolvedValue(mockResult);

      const request = createMockRequest(
        "http://localhost:3000/api/forms/form-123",
        "PUT",
        updateData
      );
      const context = createMockContext("form-123");
      const response = await PUT(request, context);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(mockDbOperations.updateForm).toHaveBeenCalledWith(
        "form-123",
        updateData
      );
      expect(data).toEqual({
        id: "form-123",
        title: "Updated Form",
        description: "Updated description",
        fields: [{ type: "email", label: "Email" }],
        settings: {},
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it("should handle database errors", async () => {
      const updateData = {
        title: "Updated Form",
      };

      mockDbOperations.updateForm.mockResolvedValue({
        success: false as const,
        error: "Form not found",
      });

      const request = createMockRequest(
        "http://localhost:3000/api/forms/form-123",
        "PUT",
        updateData
      );
      const context = createMockContext("form-123");
      const response = await PUT(request, context);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Form not found" });
    });

    it("should handle JSON parsing errors", async () => {
      const request = {
        url: "http://localhost:3000/api/forms/form-123",
        method: "PUT",
        json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
      } as unknown as NextRequest;

      const context = createMockContext("form-123");
      const response = await PUT(request, context);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Internal server error" });
    });
  });

  describe("DELETE", () => {
    it("should delete a form successfully", async () => {
      mockDbOperations.deleteForm.mockResolvedValue({
        success: true as const,
      });

      const request = createMockRequest(
        "http://localhost:3000/api/forms/form-123",
        "DELETE"
      );
      const context = createMockContext("form-123");
      const response = await DELETE(request, context);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(mockDbOperations.deleteForm).toHaveBeenCalledWith("form-123");
      expect(data).toEqual({ message: "Form deleted successfully" });
    });

    it("should handle database errors", async () => {
      mockDbOperations.deleteForm.mockResolvedValue({
        success: false as const,
        error: "Form not found",
      });

      const request = createMockRequest(
        "http://localhost:3000/api/forms/form-123",
        "DELETE"
      );
      const context = createMockContext("form-123");
      const response = await DELETE(request, context);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Form not found" });
    });

    it("should handle unexpected errors", async () => {
      mockDbOperations.deleteForm.mockRejectedValue(
        new Error("Unexpected error")
      );

      const request = createMockRequest(
        "http://localhost:3000/api/forms/form-123",
        "DELETE"
      );
      const context = createMockContext("form-123");
      const response = await DELETE(request, context);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Internal server error" });
    });
  });
});
