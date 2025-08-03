import { NextRequest, NextResponse } from "next/server";
import { createSubmission, getSubmissions } from "@/lib/db-operations";

export async function POST(request: NextRequest) {
  try {
    const { formId, data, ipAddress } = await request.json();

    if (!formId || !data) {
      return NextResponse.json(
        { error: "Form ID and data are required" },
        { status: 400 }
      );
    }

    const result = await createSubmission(formId, data, ipAddress);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error("Submissions API POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const formId = searchParams.get("formId");
    const limit = Number(searchParams.get("limit")) || 50;
    const offset = Number(searchParams.get("offset")) || 0;

    if (!formId) {
      return NextResponse.json(
        { error: "Form ID is required" },
        { status: 400 }
      );
    }

    const result = await getSubmissions(formId, limit, offset);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Submissions API GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
