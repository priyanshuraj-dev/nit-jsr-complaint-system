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
  const { id } = await context.params;

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await connectDB();

  const complaint = await Complaint.findById(id);

  if (!complaint) {
    return NextResponse.json(
      { error: "Complaint not found" },
      { status: 404 }
    );
  }

  if (complaint.status === "RESOLVED") {
    return NextResponse.json(
      { error: "Resolved complaints cannot be escalated" },
      { status: 400 }
    );
  }

  complaint.status = "ESCALATED";
  await complaint.save();

  await ComplaintHistory.create({
    complaintId: complaint._id,
    action: "ESCALATED",
    performedBy: session.user.id,
    remark: "Escalated by institute authority",
  });

  return NextResponse.json({
    success: true,
    message: "Complaint escalated successfully",
  });
}
