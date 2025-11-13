import { saveImage, fetchImage } from "../services/image.service.js";
import logger from "../utils/logger.js";

const LOG_CONTEXT = "Image Controller";

export async function saveMarkdownImage(req, res) {

    const savedImage = await saveImage(req, res);

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(savedImage));
}

export async function getImage(req, res, params) {
    const LOCAL_LOG_CONTEXT = "Get Image";
    const { fileName } = params;

    logger("info", req.traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Start fetching image: [${fileName}]`);

    const objectStream = await fetchImage(fileName, req.traceId);

    res.writeHead(200, {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=604800, must-revalidate"
    });

    objectStream.pipe(res);

    objectStream.on('error', (error) => {
        logger("error", req.traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Stream error: [${error}]`);
        if (!res.headersSent) res.writeHead(500);
        res.end(JSON.stringify({ name: "Error get image", message: "Error fetching image" }));
    });
}