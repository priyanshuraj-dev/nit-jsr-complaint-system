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

  const resolvedComplaints = await Complaint.find({
    status: "RESOLVED",
    resolvedAt: { $ne: null },
  });

  let totalTime = 0;

  resolvedComplaints.forEach((c) => {
    totalTime +=
      new Date(c.resolvedAt!).getTime() -
      new Date(c.createdAt).getTime();
  });

  const avgResolutionTime =
    resolvedComplaints.length > 0
      ? Math.round(totalTime / resolvedComplaints.length / (1000 * 60))
      : 0; // minutes

  return NextResponse.json({
    avgResolutionTimeInMinutes: avgResolutionTime,
    resolvedCount: resolvedComplaints.length,
  });
}
