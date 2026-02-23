import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET single job by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const job = await prisma.job.findUnique({
      where: { id: params.id },
      include: {
        applications: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ job }, { status: 200 });
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json(
      { error: "Failed to fetch job" },
      { status: 500 }
    );
  }
}

// PATCH update job
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const job = await prisma.job.update({
      where: { id: params.id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.department && { department: body.department }),
        ...(body.jobType && { jobType: body.jobType }),
        ...(body.location && { location: body.location }),
        ...(body.salaryRange !== undefined && { salaryRange: body.salaryRange }),
        ...(body.description && { description: body.description }),
        ...(body.requirements && { requirements: body.requirements }),
        ...(body.responsibilities && { responsibilities: body.responsibilities }),
        ...(body.status && { status: body.status }),
      },
    });

    return NextResponse.json({ job }, { status: 200 });
  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json(
      { error: "Failed to update job" },
      { status: 500 }
    );
  }
}

// DELETE job
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.job.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Job deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting job:", error);
    return NextResponse.json(
      { error: "Failed to delete job" },
      { status: 500 }
    );
  }
}
