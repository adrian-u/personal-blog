import { isEmpty } from "./general.js";
import logger from "./logger.js";
import { BodyRequestValidationError } from "../errors/custom-errors.js";
import { VALIDATION_LIMITS } from "./validation-constants.js";

const LOG_CONTEXT = "Comment Utils";

export function checkIfCommentBodyIsValid(comment, traceId) {
    const LOCAL_LOG_CONTEXT = "Body Validation";

    logger("debug", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Validation of body: ${JSON.stringify(comment, null, 4)}`);
    const FIELDS_PARENT = ["articleId", "userId", "content"];
    const FIELDS_REPLY = ["articleId", "userId", "content", "parentId"];
    let invalidFields = [];

    if (comment.isReply) {
        invalidFields = FIELDS_REPLY.filter(field => isEmpty(comment[field]));
        logger("debug", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Invalid fields array: [${invalidFields.join(", ")}]`)
    } else {
        invalidFields = FIELDS_PARENT.filter(field => isEmpty(comment[field]));
        logger("debug", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Invalid fields array: [${invalidFields.join(", ")}]`)
    }

    if (invalidFields.length > 0) {
        throw new BodyRequestValidationError(`The required fields: [${invalidFields.join(", ")}] are not present`);
    }

    if (comment.content && comment.content.length > VALIDATION_LIMITS.COMMENT_CONTENT_MAX) {
        throw new BodyRequestValidationError(`Comment content exceeds maximum length of ${VALIDATION_LIMITS.COMMENT_CONTENT_MAX} characters`);
    }
}