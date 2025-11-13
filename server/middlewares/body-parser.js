import logger from "../utils/logger.js";

export default async function bodyParser(req, res) {
    return new Promise((resolve, reject) => {
        try {
            const contentType = req.headers["content-type"] || "";
            if (contentType.startsWith("multipart/form-data")) {
                return resolve();
            }

            let body = "";

            req.on("data", chunk => (body += chunk));

            req.on("end", () => {
                try {
                    if (contentType.includes("application/json")) {
                        req.body = JSON.parse(body || "{}");
                    } else {
                        req.body = body;
                    }
                    resolve();
                } catch (error) {
                    logger("error", req.traceId, "Body-Parser", `Invalid Body Request: ${error}`);
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({
                        name: "request body error",
                        error: "Invalid Body Request"
                    }));
                }
            });

            req.on("error", err => reject(err));
        } catch (error) {
            logger("error", req.traceId, "Body-Parser", `Error reading body: ${error}`);
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({
                name: "request body error",
                error: "Error parsing body request"
            }));
        }
    });
}