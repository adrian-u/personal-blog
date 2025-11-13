import pkg from "pg";
import * as Minio from "minio";
import cron from "node-cron";

const { Pool } = pkg;

export const db = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

export const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_END_POINT,
    port: process.env.MINIO_PORT,
    useSSL: process.env.MINIO_SSL === "true",
    accessKey: process.env.MINIO_ROOT_USER,
    secretKey: process.env.MINIO_ROOT_PASSWORD,
});

const BUCKET = process.env.MINIO_MARKDOWN_IMG_BUCKET;
const DRY_RUN = process.env.DRY_RUN === 'true';

async function getMarkdownArticles() {
    await db.connect();
    const res = await db.query('SELECT markdown FROM articles');
    return res.rows.map(r => r.markdown);
}

function extractImageFilenames(markdowns) {
    const regex = /!\[.*?\]\(.*?\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-.*?\..*?)\)/g;
    const referenced = new Set();
    for (const md of markdowns) {
        let match;
        while ((match = regex.exec(md)) !== null) {
            referenced.add(match[1]);
        }
    }
    console.log(referenced);
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

async function deleteUnusedImages() {
    try {
        const markdowns = await getMarkdownArticles();
        const referencedImages = extractImageFilenames(markdowns);
        console.log(`Referenced images: ${referencedImages.size}`);

        const bucketObjects = await listBucketObjects();
        console.log(`Images in MinIO bucket: ${bucketObjects.length}`);

        for (const objName of bucketObjects) {
            if (!referencedImages.has(objName)) {
                if (DRY_RUN) {
                    console.log(`[Dry Run] Would delete: ${objName}`);
                } else {
                    await minioClient.removeObject(BUCKET, objName);
                    console.log(`Deleted: ${objName}`);
                }
            }
        }
        console.log('Cleanup completed.');
    } catch (err) {
        console.error('Error during cleanup:', err);
    }
}
/*
cron.schedule('0 3 * * 0', () => {
  console.log('Starting weekly image cleanup...');
  deleteUnusedImages();
});
*/
// Run immediately if needed
deleteUnusedImages();