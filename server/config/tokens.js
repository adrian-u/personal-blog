export const JWT_EXPIRATION_SECONDS = parseInt(process.env.JWT_EXPIRATION_SECONDS);
export const REFRESH_TOKEN_EXPIRATION_MS =
    parseInt(process.env.REFRESH_TOKEN_EXPIRATION_DAYS) * 24 * 60 * 60 * 1000;