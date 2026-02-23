import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all active jobs
export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      where: { status: "active" },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ jobs }, { status: 200 });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

// POST create new job (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.department || !body.jobType || !body.location || !body.description || !body.requirements || !body.responsibilities) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const job = await prisma.job.create({
      data: {
        title: body.title,
        department: body.department,
        jobType: body.jobType,
        location: body.location,
        salaryRange: body.salaryRange || null,
        description: body.description,
        requirements: body.requirements,
        responsibilities: body.responsibilities,
        status: body.status || "active",
      },
    });

    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}
