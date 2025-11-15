import { getJWT, logout, refreshAccessToken } from "../auth/auth";

export async function fetchWithAuth(url, options = {}) {
    let JWT = getJWT();

    if (!JWT || _isExpired(JWT)) {
        JWT = await refreshAccessToken();
        if (!JWT) {
            logout();
            throw new Error("Unauthorized");
        }
    }

    const authHeaders = {
        Authorization: `Bearer ${JWT}`,
        ...options.headers
    };

    let res = await fetch(url, {
        ...options,
        headers: authHeaders,
        credentials: "include"
    })

    if (res.status === 401) {
        const newJWT = await refreshAccessToken();
        if (!newJWT) {
            logout();
            throw new Error("Unauthorized");
        }

        res = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${newJWT}`
            },
            credentials: "include"
        });
    }

    return res;
}

function _isExpired(jwt) {
    const payload = JSON.parse(atob(jwt.split(".")[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
}