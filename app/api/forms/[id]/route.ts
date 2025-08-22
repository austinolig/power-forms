import { NextRequest, NextResponse } from "next/server";
import { getForm, updateForm, deleteForm } from "@/lib/db-operations";
import { errorResponse, successResponse } from "@/lib/utils";
import { Prisma } from "@prisma/client";

export async function GET(
  _request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
): Promise<NextResponse> {
  try {
    const { id } = await context.params;

    const result = await getForm(id);

    if (!result) {
      return NextResponse.json(errorResponse("Form not found"), {
        status: 404,
      });
    }

    return NextResponse.json(successResponse(result), { status: 200 });
  } catch (error) {
    console.error("Form API GET error:", error);

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

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const data = await request.json();
    const { id } = await context.params;

    if (data.title && data.title.length < 1) {
      return NextResponse.json(
        errorResponse("Title must be at least 1 character"),
        { status: 400 }
      );
    }

    const result = await updateForm(id, data);
    return NextResponse.json(successResponse(result), { status: 200 });
  } catch (error) {
    console.error("Form API PUT error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2025":
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

export async function DELETE(
  _request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
): Promise<NextResponse> {
  try {
    const { id } = await context.params;

    const result = await deleteForm(id);
    return NextResponse.json(successResponse(result), { status: 200 });
  } catch (error) {
    console.error("Form API DELETE error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2025":
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
