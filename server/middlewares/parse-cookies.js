export function parseCookies(req) {

    const cookieHeader = req.headers.cookie;
    req.cookies = {};

    if (!cookieHeader) return;

    cookieHeader.split(";").forEach(cookie => {
        const [key, value] = cookie.trim().split("=");
        req.cookies[key] = decodeURIComponent(value);
    });
}