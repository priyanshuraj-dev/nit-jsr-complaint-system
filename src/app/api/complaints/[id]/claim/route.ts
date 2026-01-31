import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { connectDB } from "@/lib/db";
import Complaint from "@/models/Complaint";
import ComplaintHistory from "@/models/ComplaintHistory";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // 🔴 FIX IS HERE

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can claim complaints" },
        { status: 403 }
      );
    }

    await connectDB();

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return NextResponse.json(
        { error: "Complaint not found" },
        { status: 404 }
      );
    }

    if (complaint.claimedBy) {
      return NextResponse.json(
        { error: "Complaint already claimed" },
        { status: 400 }
      );
    }

    complaint.claimedBy = session.user.id;
    complaint.status = "IN_PROGRESS";
    await complaint.save();

    await ComplaintHistory.create({
      complaintId: complaint._id,
      action: "CLAIMED",
      performedBy: session.user.id,
    });

    return NextResponse.json({
      success: true,
      message: "Complaint claimed successfully",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
