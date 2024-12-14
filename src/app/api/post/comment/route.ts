import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, userId, photoId } = body;

    console.log("Comment Data: " + JSON.stringify(req.body, null, 2));
    // Validate required fields
    if (!text || !userId || !photoId) {
      return NextResponse.json(
        { error: "All fields (text, userId, photoId) are required." },
        { status: 400 }
      );
    }

    const userExists = await db.user.findUnique({
      where: { id: userId },
    });
    if (!userExists) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const photoExists = await db.photo.findUnique({
      where: { id: photoId },
    });
    if (!photoExists) {
      return NextResponse.json({ error: "Photo not found." }, { status: 404 });
    }

    const newComment = await db.comment.create({
      data: {
        text,
        userId,
        photoId,
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json(
      {
        message: "Comment added successfully.",
        comment: {
          id: newComment.id,
          text: newComment.text,
          createdAt: newComment.createdAt,
          userId: newComment.userId,
          photoId: newComment.photoId,
          user: {
            id: newComment.user.id,
            name: newComment.user.name,
            username: newComment.user.username,
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { error: "An error occurred while adding the comment." },
      { status: 500 }
    );
  }
}
