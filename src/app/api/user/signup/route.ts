import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello World!" });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, username, password } = body;
    if (!username || !password) {
      return NextResponse.json(
        { error: "Missing username or password" },
        { status: 400 }
      );
    }

    const existingUserByUsername = await db.user.findUnique({
      where: { username: username },
    });
    if (existingUserByUsername) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.user.create({
      data: {
        name:name,
        username: username,
        password: hashedPassword,
      },
    });

    const { password: newUserPass, ...newUserWithoutPass } = newUser;
    return NextResponse.json(
      { message: "User created", user: newUserWithoutPass },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong, Try again" },
      { status: 500 }
    );
  }
}
