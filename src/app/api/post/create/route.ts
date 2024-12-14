import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

interface CloudinaryUploadResult {
  secure_url: string;
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (
  fileBuffer: Buffer
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "Photoz/images",
        resource_type: "image",
        use_filename: true,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result as CloudinaryUploadResult);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const extractFormValue = (key: string): string | null => {
      const value = formData.get(key);

      if (value === null) return null;

      if (value instanceof File) {
        throw new Error(`Expected string for ${key}, got File`);
      }

      return value.toString().trim() || null;
    };

    const description = extractFormValue("description");
    const userId = extractFormValue("userId");

    const file = formData.get("image");
    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "A valid image file is required" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const imageBuffer = Buffer.from(await file.arrayBuffer());
    const uploadResult: CloudinaryUploadResult = await uploadOnCloudinary(
      imageBuffer
    );

    const newPhoto = await db.photo.create({
      data: {
        url: uploadResult.secure_url,
        description: description,
        userId: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        comments: true,
      },
    });

    return NextResponse.json(
      {
        message: "Photo created successfully",
        photo: {
          id: newPhoto.id,
          url: newPhoto.url,
          description: newPhoto.description,
          createdAt: newPhoto.createdAt.toISOString(),
          userId: newPhoto.userId,
          user: {
            id: newPhoto.user.id,
            name: newPhoto.user.name,
            username: newPhoto.user.username,
          },
          comments: newPhoto.comments,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload process error:", error);
    return NextResponse.json(
      {
        error: "Failed to create photo",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
