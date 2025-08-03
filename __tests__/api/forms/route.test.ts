import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/forms/route";
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

describe("/api/forms", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET", () => {
    it("should return forms with default pagination", async () => {
      const mockForms = {
        success: true as const,
        data: {
          forms: [
            {
              id: "form-1",
              title: "Test Form",
              description: "Test description",
              fields: [],
              settings: {},
              createdAt: new Date(),
              updatedAt: new Date(),
              _count: { submissions: 0 },
            },
          ],
          total: 1,
          hasMore: false,
        },
      };

      mockDbOperations.getForms.mockResolvedValue(mockForms);

      const request = createMockRequest(
        "http://localhost:3000/api/forms",
        "GET"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(mockDbOperations.getForms).toHaveBeenCalledWith(10, 0);
      expect(data).toEqual({
        forms: [
          {
            id: "form-1",
            title: "Test Form",
            description: "Test description",
            fields: [],
            settings: {},
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            _count: { submissions: 0 },
          },
        ],
        total: 1,
        hasMore: false,
      });
    });

    it("should handle custom pagination parameters", async () => {
      const mockForms = {
        success: true as const,
        data: { forms: [], total: 0, hasMore: false },
      };

      mockDbOperations.getForms.mockResolvedValue(mockForms);

      const request = createMockRequest(
        "http://localhost:3000/api/forms?limit=5&offset=10",
        "GET"
      );
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(mockDbOperations.getForms).toHaveBeenCalledWith(5, 10);
    });

    it("should handle database errors", async () => {
      mockDbOperations.getForms.mockResolvedValue({
        success: false as const,
        error: "Database connection failed",
      });

      const request = createMockRequest(
        "http://localhost:3000/api/forms",
        "GET"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Database connection failed" });
    });

    it("should handle unexpected errors", async () => {
      mockDbOperations.getForms.mockRejectedValue(
        new Error("Unexpected error")
      );

      const request = createMockRequest(
        "http://localhost:3000/api/forms",
        "GET"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Internal server error" });
    });
  });

  describe("POST", () => {
    it("should create a new form successfully", async () => {
      const formData = {
        title: "New Form",
        fields: [{ type: "text", label: "Name" }],
        description: "Test form",
      };

      const mockResult = {
        success: true as const,
        data: {
          id: "form-123",
          title: formData.title,
          description: formData.description,
          fields: formData.fields,
          settings: {},
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      mockDbOperations.createForm.mockResolvedValue(mockResult);

      const request = createMockRequest(
        "http://localhost:3000/api/forms",
        "POST",
        formData
      );
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(mockDbOperations.createForm).toHaveBeenCalledWith(formData);
      expect(data).toEqual({
        id: "form-123",
        title: "New Form",
        description: "Test form",
        fields: [{ type: "text", label: "Name" }],
        settings: {},
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it("should validate required fields - missing title", async () => {
      const invalidData = {
        fields: [{ type: "text", label: "Name" }],
      };

      const request = createMockRequest(
        "http://localhost:3000/api/forms",
        "POST",
        invalidData
      );
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: "Title and fields are required" });
      expect(mockDbOperations.createForm).not.toHaveBeenCalled();
    });

    it("should validate required fields - missing fields", async () => {
      const invalidData = {
        title: "Test Form",
      };

      const request = createMockRequest(
        "http://localhost:3000/api/forms",
        "POST",
        invalidData
      );
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: "Title and fields are required" });
      expect(mockDbOperations.createForm).not.toHaveBeenCalled();
    });

    it("should validate fields is an array", async () => {
      const invalidData = {
        title: "Test Form",
        fields: "not an array",
      };

      const request = createMockRequest(
        "http://localhost:3000/api/forms",
        "POST",
        invalidData
      );
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: "Title and fields are required" });
      expect(mockDbOperations.createForm).not.toHaveBeenCalled();
    });

    it("should handle database errors", async () => {
      const formData = {
        title: "New Form",
        fields: [{ type: "text", label: "Name" }],
      };

      mockDbOperations.createForm.mockResolvedValue({
        success: false as const,
        error: "Database constraint violation",
      });

      const request = createMockRequest(
        "http://localhost:3000/api/forms",
        "POST",
        formData
      );
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Database constraint violation" });
    });

    it("should handle JSON parsing errors", async () => {
      const request = {
        url: "http://localhost:3000/api/forms",
        method: "POST",
        json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
      } as unknown as NextRequest;

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Internal server error" });
    });
  });
});
