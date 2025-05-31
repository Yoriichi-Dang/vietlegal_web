import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { auth } from "@/auth";
import crypto from "crypto";

const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const allowedFileTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const maxFileSize = 1048576 * 15; // 15 MB

const generateFileNameWithExtension = (
  originalFileName: string,
  bytes = 32
): string => {
  const extension = originalFileName.split(".").pop()?.toLowerCase() || "";
  const randomName = crypto.randomBytes(bytes).toString("hex");
  return extension ? `${randomName}.${extension}` : randomName;
};

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { failure: "not authenticated" },
        { status: 401 }
      );
    }

    const { fileType, fileSize, checksum, fileName } = await request.json();

    if (!allowedFileTypes.includes(fileType)) {
      return NextResponse.json(
        {
          failure:
            "File type not allowed. Only images (jpg, png, gif, webp), PDF, Word, and Excel files are supported.",
        },
        { status: 400 }
      );
    }

    if (fileSize > maxFileSize) {
      return NextResponse.json(
        {
          failure: `File size too large. Maximum allowed: ${
            maxFileSize / 1048576
          }MB`,
        },
        { status: 400 }
      );
    }

    const generatedFileName = fileName
      ? generateFileNameWithExtension(fileName)
      : crypto.randomBytes(32).toString("hex");

    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: generatedFileName,
      ContentType: fileType,
      ContentLength: fileSize,
      ChecksumSHA256: checksum,
    });

    const url = await getSignedUrl(s3Client, putObjectCommand, {
      expiresIn: 60,
    });

    return NextResponse.json({
      success: { url, id: 1, fileName: generatedFileName },
    });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return NextResponse.json(
      { failure: "Internal server error" },
      { status: 500 }
    );
  }
}
