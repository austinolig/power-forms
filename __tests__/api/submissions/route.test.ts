import { NextRequest } from "next/server";
import { POST, GET } from "@/app/api/submissions/route";
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

describe("/api/submissions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST", () => {
    it("should create a submission successfully", async () => {
      const submissionData = {
        formId: "form-123",
        data: { name: "John Doe", email: "john@example.com" },
        ipAddress: "192.168.1.1",
      };

      const mockResult = {
        success: true as const,
        data: {
          id: "submission-456",
          formId: submissionData.formId,
          data: submissionData.data,
          ipAddress: submissionData.ipAddress,
          submittedAt: new Date(),
        },
      };

      mockDbOperations.createSubmission.mockResolvedValue(mockResult);

      const request = createMockRequest(
        "http://localhost:3000/api/submissions",
        "POST",
        submissionData
      );
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(mockDbOperations.createSubmission).toHaveBeenCalledWith(
        submissionData.formId,
        submissionData.data,
        submissionData.ipAddress
      );
      expect(data).toEqual({
        id: "submission-456",
        formId: "form-123",
        data: { name: "John Doe", email: "john@example.com" },
        ipAddress: "192.168.1.1",
        submittedAt: expect.any(String),
      });
    });

    it("should create a submission without IP address", async () => {
      const submissionData = {
        formId: "form-123",
        data: { name: "John Doe", email: "john@example.com" },
      };

      const mockResult = {
        success: true as const,
        data: {
          id: "submission-456",
          formId: submissionData.formId,
          data: submissionData.data,
          ipAddress: null,
          submittedAt: new Date(),
        },
      };

      mockDbOperations.createSubmission.mockResolvedValue(mockResult);

      const request = createMockRequest(
        "http://localhost:3000/api/submissions",
        "POST",
        submissionData
      );
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(mockDbOperations.createSubmission).toHaveBeenCalledWith(
        submissionData.formId,
        submissionData.data,
        undefined
      );
      expect(data).toEqual({
        id: "submission-456",
        formId: "form-123",
        data: { name: "John Doe", email: "john@example.com" },
        ipAddress: null,
        submittedAt: expect.any(String),
      });
    });

    it("should validate required fields - missing formId", async () => {
      const invalidData = {
        data: { name: "John Doe" },
      };

      const request = createMockRequest(
        "http://localhost:3000/api/submissions",
        "POST",
        invalidData
      );
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: "Form ID and data are required" });
      expect(mockDbOperations.createSubmission).not.toHaveBeenCalled();
    });

    it("should validate required fields - missing data", async () => {
      const invalidData = {
        formId: "form-123",
      };

      const request = createMockRequest(
        "http://localhost:3000/api/submissions",
        "POST",
        invalidData
      );
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: "Form ID and data are required" });
      expect(mockDbOperations.createSubmission).not.toHaveBeenCalled();
    });

    it("should handle database errors", async () => {
      const submissionData = {
        formId: "nonexistent-form",
        data: { name: "John Doe" },
      };

      mockDbOperations.createSubmission.mockResolvedValue({
        success: false as const,
        error: "Form not found",
      });

      const request = createMockRequest(
        "http://localhost:3000/api/submissions",
        "POST",
        submissionData
      );
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Form not found" });
    });

    it("should handle JSON parsing errors", async () => {
      const request = {
        url: "http://localhost:3000/api/submissions",
        method: "POST",
        json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
      } as unknown as NextRequest;

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Internal server error" });
    });
  });

  describe("GET", () => {
    it("should return submissions for a form successfully", async () => {
      const mockSubmissions = {
        success: true as const,
        data: {
          submissions: [
            {
              id: "submission-1",
              formId: "form-123",
              data: { name: "John Doe", email: "john@example.com" },
              ipAddress: "192.168.1.1",
              submittedAt: new Date(),
            },
            {
              id: "submission-2",
              formId: "form-123",
              data: { name: "Jane Smith", email: "jane@example.com" },
              ipAddress: "192.168.1.2",
              submittedAt: new Date(),
            },
          ],
          total: 2,
          hasMore: false,
        },
      };

      mockDbOperations.getSubmissions.mockResolvedValue(mockSubmissions);

      const request = createMockRequest(
        "http://localhost:3000/api/submissions?formId=form-123",
        "GET"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(mockDbOperations.getSubmissions).toHaveBeenCalledWith(
        "form-123",
        50,
        0
      );
      expect(data).toEqual({
        submissions: [
          {
            id: "submission-1",
            formId: "form-123",
            data: { name: "John Doe", email: "john@example.com" },
            ipAddress: "192.168.1.1",
            submittedAt: expect.any(String),
          },
          {
            id: "submission-2",
            formId: "form-123",
            data: { name: "Jane Smith", email: "jane@example.com" },
            ipAddress: "192.168.1.2",
            submittedAt: expect.any(String),
          },
        ],
        total: 2,
        hasMore: false,
      });
    });

    it("should handle custom pagination parameters", async () => {
      const mockSubmissions = {
        success: true as const,
        data: { submissions: [], total: 0, hasMore: false },
      };

      mockDbOperations.getSubmissions.mockResolvedValue(mockSubmissions);

      const request = createMockRequest(
        "http://localhost:3000/api/submissions?formId=form-123&limit=10&offset=20",
        "GET"
      );
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(mockDbOperations.getSubmissions).toHaveBeenCalledWith(
        "form-123",
        10,
        20
      );
    });

    it("should validate required formId parameter", async () => {
      const request = createMockRequest(
        "http://localhost:3000/api/submissions",
        "GET"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: "Form ID is required" });
      expect(mockDbOperations.getSubmissions).not.toHaveBeenCalled();
    });

    it("should handle database errors", async () => {
      mockDbOperations.getSubmissions.mockResolvedValue({
        success: false as const,
        error: "Form not found",
      });

      const request = createMockRequest(
        "http://localhost:3000/api/submissions?formId=nonexistent",
        "GET"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Form not found" });
    });

    it("should handle unexpected errors", async () => {
      mockDbOperations.getSubmissions.mockRejectedValue(
        new Error("Unexpected error")
      );

      const request = createMockRequest(
        "http://localhost:3000/api/submissions?formId=form-123",
        "GET"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Internal server error" });
    });
  });
});
