import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { connectDB } from "@/lib/db";
import ComplaintHistory from "@/models/ComplaintHistory";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await connectDB();

  const history = await ComplaintHistory.find()
    .populate("performedBy", "name role email")
    .sort({ timestamp: -1 })
    .limit(100); // safety limit

  return NextResponse.json(history);
}
