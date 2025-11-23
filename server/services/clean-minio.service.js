import { minioClient } from "../config/minio.js"
import { db } from "../config/db.js";
import logger from "../utils/logger.js";

const BUCKET = process.env.MINIO_MARKDOWN_IMG_BUCKET;
const DRY_RUN = process.env.DRY_RUN === 'true';
const LOG_CONTEXT = "Cleanup MinIO";

export default async function deleteUnusedImages(traceId) {
    const LOCAL_LOG_CONTEXT = "Delete Unused Images";
    try {
        const markdowns = await getMarkdownArticles();
        const referencedImages = extractImageFilenames(markdowns, traceId);
        logger("debug", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Referenced images: ${referencedImages.size}`);

        const bucketObjects = await listBucketObjects();
        logger("debug", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Images in MinIO bucket: ${bucketObjects.length}`);

        for (const objName of bucketObjects) {
            if (!referencedImages.has(objName)) {
                if (DRY_RUN) {
                    logger("warn", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `[Dry Run] Would delete: ${objName}`);
                } else {
                    await minioClient.removeObject(BUCKET, objName);
                    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Deleted: ${objName}`);
                }
            }
        }
        logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, "Cleanup completed.");
    } catch (error) {
        logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Error during cleanup: [${error}]`);
    }
}

async function getMarkdownArticles() {
    const res = await db.query('SELECT markdown FROM articles');
    return res.rows.map(r => r.markdown);
}

function extractImageFilenames(markdowns, traceId) {
    const LOCAL_LOG_CONTEXT = "Extract Image";
    const regex = /!\[.*?\]\(.*?\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-.*?\..*?)\)/g;
    const referenced = new Set();
    for (const md of markdowns) {
        let match;
        while ((match = regex.exec(md)) !== null) {
            referenced.add(match[1]);
        }
    }
    logger("info", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Referenced images: ${JSON.stringify(referenced)}`);
    return referenced;
}

async function listBucketObjects() {
    return new Promise((resolve, reject) => {
        const objects = [];
        const stream = minioClient.listObjectsV2(BUCKET, '', true);
        stream.on('data', obj => objects.push(obj.name));
        stream.on('error', err => reject(err));
        stream.on('end', () => resolve(objects));
    });
}

