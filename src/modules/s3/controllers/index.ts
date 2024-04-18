import { Response, Request } from "express";
import { bucketName, rekognitionClient, s3Client } from "../service";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

import multer from "multer";
import { DetectTextCommand } from "@aws-sdk/client-rekognition";
import { searchPlate } from "../../../utils/plate";

const upload = multer({
    storage: multer.memoryStorage(),
});

export const sendFileToBucket = [
    upload.single("file"),
    async (req: Request, res: Response) => {
        try {
            const file = req.file; 
            if (!file) return res.status(400).send({ message: "No file uploaded" });
            
            const sendBucket = await s3Client.send(
                new PutObjectCommand({
                    Bucket: bucketName,
                    Key: file.originalname,
                    Body: file.buffer
                })
            );

            const { url } = await createPresignedPost(s3Client, {
                Bucket: bucketName,
                Key: file.originalname,
                Expires: 60 * 60,
            });
            const rekognitionResponse = await sendToRekognition(bucketName, file.originalname);

            const plates: string[] = [];
            for (const text of rekognitionResponse.TextDetections || []) {
                const plate = searchPlate(text.DetectedText || "");
                if (plate) {
                    plates.push(plate);
                }
            }

            res.send({ plates });
        }
        catch (error) {
            res.status(500).send({ message: error });
        }
    }
];

async function sendToRekognition(bucketName: string, key: string) {
    const input = {
        Image: {
            S3Object: {
                Bucket: bucketName,
                Name: key
            }
        }
    }

    const command = new DetectTextCommand(input);
    return await rekognitionClient.send(command);
}