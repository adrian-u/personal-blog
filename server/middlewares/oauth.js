import { authorizeRole, verifyJWT } from "../services/oauth.service.js";
import logger from "../utils/logger.js";
import { AuthorizationError } from "../errors/custom-errors.js";

const LOG_CONTEXT = "Auth";

export function withAuthentication(handler) {
    const LOCAL_LOG_CONTEXT = "Authentication";

    return async (req, res, params) => {
        logger("info", req.traceId, `${LOG_CONTEXT}-${LOCAL_LOG_CONTEXT}`, "Start authenticating user");
        const user = verifyJWT(req);
        req.user = user;

        logger("info", req.traceId, LOG_CONTEXT, `User ${user.sub} authenticated`);
        await handler(req, res, params);
    }
}

export function withAuthorization(handler) {
    const LOCAL_LOG_CONTEXT = "Authorization";

    return async (req, res, params) => {
        logger("info", req.traceId, `${LOG_CONTEXT}-${LOCAL_LOG_CONTEXT}`,
            `Start authorizing user: [${req.user.sub}]`);

        if (authorizeRole(req, "creator")) {
            logger("info", req.traceId, LOG_CONTEXT, `User [${req.user.sub}] authorized`);
            await handler(req, res, params);
        } else {
            throw new AuthorizationError("User not authorized");
        }
    };
}