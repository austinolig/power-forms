import { NextRequest, NextResponse } from "next/server";
import { createSubmission, getSubmissions } from "@/lib/db-operations";
import { errorResponse, successResponse } from "@/utils/api";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const formId = searchParams.get("formId");
    const limit = Number(searchParams.get("limit")) || 50;
    const offset = Number(searchParams.get("offset")) || 0;

    if (!formId) {
      return NextResponse.json(errorResponse("Form ID is required"), {
        status: 400,
      });
    }

    if (limit < 1 || offset < 0) {
      return NextResponse.json(errorResponse("Invalid limit or offset"), {
        status: 400,
      });
    }

    const result = await getSubmissions(formId, limit, offset);
    return NextResponse.json(successResponse(result), { status: 200 });
  } catch (error) {
    console.error("Submissions API GET error:", error);
    return NextResponse.json(errorResponse("Internal server error"), {
      status: 500,
    });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { formId, data } = await request.json();

    if (!formId || !data) {
      return NextResponse.json(errorResponse("Form ID and data are required"), {
        status: 400,
      });
    }

    const result = await createSubmission(formId, data);
    return NextResponse.json(successResponse(result), { status: 201 });
  } catch (error) {
    console.error("Submissions API POST error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2003":
          return NextResponse.json(errorResponse("Form not found"), {
            status: 404,
          });
        default:
          return NextResponse.json(errorResponse("Database error"), {
            status: 500,
          });
      }
    }

    return NextResponse.json(errorResponse("Internal server error"), {
      status: 500,
    });
  }
}
