import * as Minio from "minio";

export const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_END_POINT,
    port: process.env.MINIO_PORT,
    useSSL: process.env.MINIO_SSL === "true",
    accessKey: process.env.MINIO_ROOT_USER,
    secretKey: process.env.MINIO_ROOT_PASSWORD,
});