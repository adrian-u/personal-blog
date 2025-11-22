import logger from "../utils/logger.js";
import { TooManyRequestsError } from "../errors/custom-errors.js";

const requestStore = new Map();
const MAX_REQUESTS = 30;
const WINDOW_MS = 60 * 1000;
const CLEANUP_INTERVAL = 60 * 1000;

setInterval(() => {
    const now = Date.now();
    for (const [ip, timestamps] of requestStore.entries()) {
        const filtered = timestamps.filter(t => now - t < WINDOW_MS);
        if (filtered.length === 0) {
            requestStore.delete(ip);
        } else {
            requestStore.set(ip, filtered);
        }
    }
}, CLEANUP_INTERVAL);

export function withRateLimit(handler) {
    return async (req, res, params) => {
        const clientIp = req.headers['x-forwarded-for']?.split(',')[0] ||
            req.socket.remoteAddress ||
            'unknown';

        if (!requestStore.has(clientIp)) {
            requestStore.set(clientIp, []);
        }

        const now = Date.now();
        const windowStart = now - WINDOW_MS;

        const timestamps = requestStore.get(clientIp);
        const validTimestamps = timestamps.filter(t => t > windowStart);

        if (validTimestamps.length >= MAX_REQUESTS) {
            logger("warn", req.traceId, "Rate Limit",
                `Rate limit exceeded for IP ${clientIp}. Limit: ${MAX_REQUESTS} requests per minute`);
            throw new TooManyRequestsError("Too many requests. Please try again later.");
        }

        validTimestamps.push(now);
        requestStore.set(clientIp, validTimestamps);

        res.setHeader('X-RateLimit-Limit', MAX_REQUESTS);
        res.setHeader('X-RateLimit-Remaining', MAX_REQUESTS - validTimestamps.length);
        res.setHeader('X-RateLimit-Reset', new Date(windowStart + WINDOW_MS).toISOString());

        await handler(req, res, params);
    };
}
