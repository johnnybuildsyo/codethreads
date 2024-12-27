import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

interface UploadToS3Params {
  bucketName: string
  key: string
  body: Buffer
  contentType: string
}

/**
 * Uploads a file to S3.
 * @param {UploadToS3Params} params - The parameters for the S3 upload.
 * @returns {string} The public URL of the uploaded file.
 * @throws {Error} If the upload fails.
 */
export async function uploadToS3({ bucketName, key, body, contentType }: UploadToS3Params): Promise<string> {
  console.log("Starting S3 upload:", { bucketName, key, contentType, bodySize: body.length })

  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
      ACL: "bucket-owner-full-control",
    })

    console.log("Sending S3 command")
    await s3Client.send(command)
    console.log("S3 command successful")

    const url = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
    console.log("Generated S3 URL:", url)
    return url
  } catch (error) {
    console.error("S3 upload error:", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })
    throw new Error("Failed to upload file to S3")
  }
}
