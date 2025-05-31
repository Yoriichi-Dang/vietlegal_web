import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { auth } from "@/auth";
const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

import crypto from "crypto";

// comment out the import and use this for edge functions
// const generateFileName = (bytes = 32) => {
//   const array = new Uint8Array(bytes)
//   crypto.getRandomValues(array)
//   return [...array].map((b) => b.toString(16).padStart(2, "0")).join("")
// }

const allowedFileTypes = [
  // Images
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",

  // PDF
  "application/pdf",

  // Microsoft Word
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx

  // Microsoft Excel
  "application/vnd.ms-excel", // .xls
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
];

const maxFileSize = 1048576 * 15; // 15 MB
const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

// Function để preserve file extension
const generateFileNameWithExtension = (
  originalFileName: string,
  bytes = 32
): string => {
  const extension = originalFileName.split(".").pop()?.toLowerCase() || "";
  const randomName = crypto.randomBytes(bytes).toString("hex");
  return extension ? `${randomName}.${extension}` : randomName;
};

type SignedURLResponse = Promise<
  | { failure?: undefined; success: { url: string; id: number } }
  | { failure: string; success?: undefined }
>;

type GetSignedURLParams = {
  fileType: string;
  fileSize: number;
  checksum: string;
  fileName?: string;
};
export const getSignedURL = async ({
  fileType,
  fileSize,
  checksum,
  fileName,
}: GetSignedURLParams): SignedURLResponse => {
  const session = await auth();

  if (!session) {
    return { failure: "not authenticated" };
  }

  if (!allowedFileTypes.includes(fileType)) {
    return {
      failure:
        "File type not allowed. Only images (jpg, png, gif, webp), PDF, Word, and Excel files are supported.",
    };
  }

  if (fileSize > maxFileSize) {
    return {
      failure: `File size too large. Maximum allowed: ${
        maxFileSize / 1048576
      }MB`,
    };
  }

  const generatedFileName = fileName
    ? generateFileNameWithExtension(fileName)
    : generateFileName();

  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: generatedFileName,
    ContentType: fileType,
    ContentLength: fileSize,
    ChecksumSHA256: checksum,
  });

  const url = await getSignedUrl(
    s3Client,
    putObjectCommand,
    { expiresIn: 60 } // 60 seconds
  );

  console.log({ success: url });
  return { success: { url, id: 1 } };
};
