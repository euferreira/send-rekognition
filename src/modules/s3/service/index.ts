import { RekognitionClient } from "@aws-sdk/client-rekognition";
import { S3Client } from "@aws-sdk/client-s3";
import 'dotenv/config'

const config = {
    region: process.env.AWS_REGION || 'us-east-1',
    apiVersion: 'latest',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET || "",
    },
};

const s3Client = new S3Client(config);
const rekognitionClient = new RekognitionClient(config);

const bucketName = process.env.AWS_BUCKET_NAME || "";

export { s3Client, rekognitionClient, bucketName };