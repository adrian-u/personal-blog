import { getJWT, logout, refreshAccessToken, isUserLoggedIn } from "../auth/auth";

export async function fetchWithAuth(url, options = {}) {
    let JWT = getJWT();

    if (!JWT || isExpired(JWT)) {
        if (isUserLoggedIn()) {
            JWT = await refreshAccessToken();
            if (!JWT) {
                logout();
                throw new Error("Unauthorized");
            }
        } else {
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
        if (isUserLoggedIn()) {
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
        } else {
            logout();
            throw new Error("Unauthorized");
        }
    }

    return res;
}

export function isExpired(jwt) {
    const payload = JSON.parse(atob(jwt.split(".")[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
}