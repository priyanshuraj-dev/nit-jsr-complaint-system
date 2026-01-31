import { NextResponse } from "next/server";
import {connectDB} from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { name, email, password, role, registrationNumber } =
    await req.json();

  await connectDB();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json(
      { error: "User already exists" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    name,
    email,
    role,
    registrationNumber: registrationNumber || null,
    password: hashedPassword,
  });

  return NextResponse.json({ success: true });
}
