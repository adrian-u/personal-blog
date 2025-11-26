export function getPublicBaseURL() {
    const protocol = process.env.NODE_ENV === "prod" ? "https" : "http";
    const host = process.env.PUBLIC_HOST;
    const port = process.env.PUBLIC_PORT;

    if (process.env.NODE_ENV === "prod" || !port) {
        return `${protocol}://${host}`;
    }

    return `${protocol}://${host}:${port}`;
}