import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all applications (admin only)
export async function GET() {
  try {
    const applications = await prisma.application.findMany({
      include: { 
        job: {
          select: {
            title: true,
            department: true,
          }
        } 
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ applications }, { status: 200 });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

// POST create new application
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.jobId || !body.fullName || !body.email || !body.phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if job exists
    const job = await prisma.job.findUnique({
      where: { id: body.jobId },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    const application = await prisma.application.create({
      data: {
        jobId: body.jobId,
        fullName: body.fullName,
        email: body.email,
        phone: body.phone,
        resumeUrl: body.resumeUrl || null,
        coverLetter: body.coverLetter || null,
        linkedIn: body.linkedIn || null,
        expectedSalary: body.expectedSalary || null,
        availableDate: body.availableDate || null,
      },
    });

    return NextResponse.json({ application }, { status: 201 });
  } catch (error) {
    console.error("Error creating application:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}
