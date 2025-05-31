// app/api/delete-file/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  S3Client,
  DeleteObjectCommand,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import { auth } from "@/auth";

const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileKey, fileKeys } = await request.json();

    // Validate input
    if (!fileKey && !fileKeys) {
      return NextResponse.json(
        { error: "fileKey or fileKeys is required" },
        { status: 400 }
      );
    }

    // Single file deletion
    if (fileKey) {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: fileKey,
      });

      await s3Client.send(deleteCommand);

      return NextResponse.json({
        success: true,
        message: "File deleted successfully",
        deletedFile: fileKey,
      });
    }

    // Multiple files deletion
    if (fileKeys && Array.isArray(fileKeys) && fileKeys.length > 0) {
      // S3 allows max 1000 objects per delete request
      if (fileKeys.length > 1000) {
        return NextResponse.json(
          { error: "Maximum 1000 files can be deleted at once" },
          { status: 400 }
        );
      }

      const deleteCommand = new DeleteObjectsCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Delete: {
          Objects: fileKeys.map((key: string) => ({ Key: key })),
          Quiet: false, // Return info about deleted objects
        },
      });

      const result = await s3Client.send(deleteCommand);

      return NextResponse.json({
        success: true,
        message: "Files deleted successfully",
        deleted: result.Deleted,
        errors: result.Errors,
        deletedCount: result.Deleted?.length || 0,
      });
    }

    return NextResponse.json(
      { error: "Invalid request format" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error deleting file(s):", error);

    // Handle specific S3 errors
    if (error instanceof Error && error.name === "NoSuchKey") {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    if (error instanceof Error && error.name === "AccessDenied") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    return NextResponse.json(
      {
        error: "Failed to delete file(s)",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Optional: Support POST method for flexibility
export async function POST(request: NextRequest) {
  return DELETE(request);
}
