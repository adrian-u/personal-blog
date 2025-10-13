export default async function bodyParser(req) {
    return new Promise((resolve, reject) => {
        try {
            let body = "";

            req.on("data", chunk => (body += chunk));

            req.on("end", () => {
                try {
                    if (req.headers["content-type"]?.includes("application/json")) {
                        req.body = JSON.parse(body || "{}");
                    } else {
                        req.body = body;
                    }
                    resolve();
                } catch (error) {
                    console.error(`Invalid JSON: ${error}`);
                    reject(new Error("Invalid JSON"));
                }
            });

            req.on("error", err => reject(err));

        } catch (error) {
            console.error(`Error reading body: ${error}`);
            reject(error);
        }
    });
}