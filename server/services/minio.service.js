import { minioClient } from "../config/minio.js";
import { MinIOSaveError } from "../errors/custom-errors.js";
import { Readable } from "stream";
import logger from "../utils/logger.js";

const BUCKET = process.env.MINIO_AVATARS_BUCKET;
const LOG_CONTEXT = "MinIO Service";

export default async function insertAvatar(user, provider, traceId) {
    const LOCAL_LOG_CONTEXT = "Save Avatar";
    const exists = await minioClient.bucketExists(BUCKET);
    if (!exists) {
        logger("info", traceId, `${LOCAL_LOG_CONTEXT}-${LOG_CONTEXT}`, `Bucket [${BUCKET}] not found`);
        throw new MinIOSaveError("Bucket not found");
    }

    const objectName = `avatars/${provider}-${user.email}-avatar.png`;
    try {
        const res = await fetch(user.picture);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const metaData = {
            "Content-Type": "image/png",
        };

        const nodeStream = Readable.from(res.body);

        await minioClient.putObject(BUCKET, objectName, nodeStream, metaData);

        logger("info", traceId, `${LOCAL_LOG_CONTEXT}-${LOG_CONTEXT}`, `Avatar uploaded as [${objectName}]`);
        const protocol = process.env.NODE_ENV === "prod" ? "https" : "http";
        const avatarUrlPublic = `${protocol}://${process.env.PUBLIC_HOST}:${process.env.PUBLIC_PORT}/api/v1/user/avatars/${objectName.split("/")[1]}`;
        return avatarUrlPublic;

    } catch (error) {
        logger("error", traceId, `${LOCAL_LOG_CONTEXT}-${LOG_CONTEXT}`, `Failed to save avatar: [${error}]`);
        throw new MinIOSaveError("Failed to save the avatar");
    }
}

export async function getAvatar(fileName, traceId) {
    const LOCAL_LOG_CONTEXT = "Get Avatar";
    logger("info", traceId, `${LOCAL_LOG_CONTEXT}-${LOG_CONTEXT}`, `Start  fetching avatar: ${fileName}`);
    try {
        const objectStream = await minioClient.getObject(
            BUCKET,
            `avatars/${fileName}`
        );
        return objectStream;
    } catch (error) {
        logger("error", req.traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Avatar not found: [${fileName}] - ${err}`);
        throw Error("Avatar not found");
    }
}