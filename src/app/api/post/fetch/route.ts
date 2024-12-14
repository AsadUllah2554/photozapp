import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const posts = await db.photo.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: { id: true, name: true, username: true },
        },
        comments: {
          include: {
            user: {
              select: { id: true, name: true, username: true },
            },
          },
        },
      },
    });

    return NextResponse.json({ posts }, { status: 200, headers: {
      'Cache-Control': 'no-store, max-age=0',
    }, });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export const revalidate = 0;
