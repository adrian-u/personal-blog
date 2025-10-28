import logger from "../utils/logger.js";

export function withErrorHandling(handler) {
    return async (req, res, params) => {
        try {
            await handler(req, res, params);
        } catch (error) {
            logger("error", req.traceId, "Global", `Global error handler: ${error.stack}`);
            const status = error.statusCode || 500;
            res.writeHead(status, { "Content-Type": "application/json" });
            res.end(JSON.stringify({
                name: error.name || "Internal Error",
                error: error.message || "Unexpected error occurred",
            }));
        }
    }
}