import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import { connectDB } from "@/lib/db";
import Complaint from "@/models/Complaint";
import ComplaintHistory from "@/models/ComplaintHistory";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log(session);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.user.role !== "STUDENT") {
      return NextResponse.json(
        { error: "Only students can create complaints" },
        { status: 403 }
      );
    }

    const existingInProgress = await Complaint.findOne({
        createdBy: session.user.id,
        status: "IN_PROGRESS",
    });

    if (existingInProgress) {
    return NextResponse.json(
        {
        error:
            "You already have a complaint in progress. Please wait until it is resolved.",
        },
        { status: 400 }
    );
    }

    const { title, description, category } = await req.json();

    if (!title || !description || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    const complaint = await Complaint.create({
      title,
      description,
      category,
      createdBy: session.user.id,
    });

    await ComplaintHistory.create({
      complaintId: complaint._id,
      action: "CREATED",
      performedBy: session.user.id,
    });

    return NextResponse.json({
      success: true,
      complaintId: complaint._id,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
