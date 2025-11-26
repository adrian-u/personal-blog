export function getPublicBaseURL() {
    const protocol = process.env.NODE_ENV === "prod" ? "https" : "http";
    let host = (process.env.PUBLIC_HOST || "").trim();
    let port = process.env.PUBLIC_PORT;

    host = host.replace(/^https?:\/\//i, "");
    host = host.replace(/^\/+|\/+$/g, "");

    if (host.includes(":")) {
        const parts = host.split(":");
        if (parts.length === 2) {
            host = parts[0];
            port = parts[1];
        }
    }

    if (!host) host = "localhost";

    if (process.env.NODE_ENV === "prod" || !port) {
        return `${protocol}://${host}`;
    }

    return `${protocol}://${host}:${port}`;
}