import Busboy from "busboy";
import { minioClient } from "../config/minio.js";
import { randomUUID } from "crypto";
import logger from "../utils/logger.js";

const LOG_CONTEXT = "Image Service";

export async function saveImage(req, res) {
    return new Promise((resolve, reject) => {
        const busboy = Busboy({ headers: req.headers });
        let uploadedFileName;
        let uploadPromise;

        busboy.on("file", (fieldname, file, info) => {
            const { filename, mimeType } = info;

            const objectName = `${randomUUID()}-${filename}`;
            uploadedFileName = objectName;

            uploadPromise = minioClient.putObject(
                process.env.MINIO_MARKDOWN_IMG_BUCKET,
                objectName,
                file,
                undefined,
                { "Content-Type": mimeType }
            );
        });

        busboy.on("finish", async () => {
            try {
                await uploadPromise;
                const protocol = process.env.NODE_ENV === "prod" ? "https" : "http";
                const fileUrl = `${protocol}://${process.env.PUBLIC_HOST}:${process.env.PUBLIC_PORT}/api/v1/images/${uploadedFileName}`;
                const responseObject = {
                    href: fileUrl,
                    alt: uploadedFileName
                };

                resolve(responseObject);
            } catch (error) {
                logger("error", req.traceId, "Upload Markdown Image", `Failed to upload the image. Error: [${error}]`);
                reject(error);
            }
        });

        busboy.on("error", (error) => {
            logger("error", req.traceId, "Upload Markdown Image", `Failed to upload the image. Error: [${error}]`);
            reject(error);
        });

        req.pipe(busboy);
    });
}

export async function fetchImage(fileName, traceId) {
    const LOCAL_LOG_CONTEXT = "Get Image";
    logger("info", traceId, `${LOCAL_LOG_CONTEXT}-${LOG_CONTEXT}`, `Start  fetching image: ${fileName}`);
    try {
        const objectStream = await minioClient.getObject(
            process.env.MINIO_MARKDOWN_IMG_BUCKET,
            `${fileName}`
        );
        return objectStream;
    } catch (error) {
        logger("error", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Image not found: [${fileName}] - ${error}`);
        throw Error("Image not found");
    }
}