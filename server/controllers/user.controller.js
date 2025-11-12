import { getAvatar } from '../services/minio.service.js';
import { getUserDetailsById, deleteUserById } from '../services/user.service.js';
import logger from '../utils/logger.js';

const LOG_CONTEXT = "User Controller";

export async function getUserDetails(req, res, params) {
    const LOCAL_LOG_CONTEXT = "Get User Details";
    const { id } = params;

    logger("info", req.traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Start fetching user data for id: [${id}]`);

    const userInfo = await getUserDetailsById(id, req.traceId);
    res.writeHead(200, { 'Content-Type': 'application/json', });
    res.end(JSON.stringify(userInfo));
}

export async function deleteUser(req, res, params) {
    const LOCAL_LOG_CONTEXT = "Delete User";
    const { id } = params;

    logger("info", req.traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Start deleting user with id: [${id}]`);

    await deleteUserById(id, req.traceId);
    res.writeHead(204, { 'Content-Type': 'application/json', });
    res.end();

}

export async function getUserAvatar(req, res, params) {
    const LOCAL_LOG_CONTEXT = "Get Avatar";
    const { fileName } = params;

    logger("info", req.traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Start fetching avatar: [${fileName}]`);

    const objectStream = await getAvatar(fileName, req.traceId);

    res.writeHead(200, {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=604800, must-revalidate"
    });

    objectStream.pipe(res);

    objectStream.on('error', (err) => {
        logger("error", req.traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Stream error: [${err}]`);
        if (!res.headersSent) res.writeHead(500);
        res.end(JSON.stringify({ name: "Error get avatar", message: "Error fetching avatar" }));
    });
}