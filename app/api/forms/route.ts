import { NextRequest, NextResponse } from "next/server";
import { getForms, createForm } from "@/lib/db-operations";
import { errorResponse, successResponse } from "@/lib/utils";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Number(searchParams.get("limit")) || 10;
    const offset = Number(searchParams.get("offset")) || 0;

    if (limit < 1 || offset < 0) {
      return NextResponse.json(errorResponse("Invalid limit or offset"), {
        status: 400,
      });
    }

    const result = await getForms(limit, offset);
    return NextResponse.json(successResponse(result), { status: 200 });
  } catch (error) {
    console.error("Forms API GET error:", error);
    return NextResponse.json(errorResponse("Internal server error"), {
      status: 500,
    });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const data = await request.json();

    if (!data.title || !data.fields) {
      return NextResponse.json(errorResponse("Title and fields are required"), {
        status: 400,
      });
    }

    const result = await createForm(data);
    return NextResponse.json(successResponse(result), { status: 201 });
  } catch (error) {
    console.error("Forms API POST error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
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
