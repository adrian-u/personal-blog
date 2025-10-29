import { getUserDetailsByEmail } from '../services/user.service.js';
import logger from '../utils/logger.js';

export async function getUserDetails(req, res, params) {

    const { email } = params;

    logger("info", req.traceId, "Fetching user data", `Start fetching user data for email: ${email}`);

    const userInfo = await getUserDetailsByEmail(email, req.traceId);
    res.writeHead(200, { 'Content-Type': 'application/json', });
    res.end(JSON.stringify(userInfo));
} 