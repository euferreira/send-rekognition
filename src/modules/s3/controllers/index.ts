import { Response, Request } from "express";
import { bucketName, rekognitionClient, s3Client } from "../service";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

import multer from "multer";
import { DetectTextCommand } from "@aws-sdk/client-rekognition";

const upload = multer({
    dest: "uploads/"
});

export const sendFileToBucket = [
    upload.single("file"),
    async (req: Request, res: Response) => {
        try {
            const file = req.file as Express.Multer.File;
            await s3Client.send(
                new PutObjectCommand({
                    Bucket: bucketName,
                    Key: file.originalname,
                    Body: file.buffer
                })
            );

            const params = {
                Bucket: bucketName,
                Key: file.originalname,
                Expires: 60 * 60, // 1 hour
            };

            const { url } = await createPresignedPost(s3Client, params);
            const rekognitionResponse = await sendToRekognition(bucketName, file.originalname);

            res.send({ message: url, rekognitionResponse });
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