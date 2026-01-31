import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { connectDB } from "@/lib/db";
import Complaint from "@/models/Complaint";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await connectDB();

  const total = await Complaint.countDocuments();
  const open = await Complaint.countDocuments({ status: "OPEN" });
  const inProgress = await Complaint.countDocuments({ status: "IN_PROGRESS" });
  const resolved = await Complaint.countDocuments({ status: "RESOLVED" });
  const escalated = await Complaint.countDocuments({status: "ESCALATED"})
  return NextResponse.json({
    total,
    open,
    inProgress,
    resolved,
    escalated
  });
}
