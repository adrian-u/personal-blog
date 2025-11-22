import { isEmpty } from "./general.js";
import logger from "./logger.js";
import { BodyRequestValidationError } from "../errors/custom-errors.js";
import { VALIDATION_LIMITS } from "./validation-constants.js";

const LOG_CONTEXT = "Article Utils";

export function checkIfArticleBodyIsValid(article, traceId) {
    const LOCAL_LOG_CONTEXT = "Body Validation";

    logger("debug", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Validation of body: ${JSON.stringify(article, null, 4)}`);
    const FIELDS = ["title", "icon", "category", "description", "markdown"];
    const invalidFields = FIELDS.filter(field => isEmpty(article[field]));
    logger("debug", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Invalid fields array: [${invalidFields.join(", ")}]`)

    if (invalidFields.length > 0) {
        throw new BodyRequestValidationError(`The required fields: [${invalidFields.join(", ")}] are not present`);
    }

    if (article.title && article.title.length > VALIDATION_LIMITS.ARTICLE_TITLE_MAX) {
        throw new BodyRequestValidationError(`Article title exceeds maximum length of ${VALIDATION_LIMITS.ARTICLE_TITLE_MAX} characters`);
    }

    if (article.description && article.description.length > VALIDATION_LIMITS.ARTICLE_DESCRIPTION_MAX) {
        throw new BodyRequestValidationError(`Article description exceeds maximum length of ${VALIDATION_LIMITS.ARTICLE_DESCRIPTION_MAX} characters`);
    }

    if (article.markdown && article.markdown.length > VALIDATION_LIMITS.ARTICLE_MARKDOWN_MAX) {
        throw new BodyRequestValidationError(`Article markdown exceeds maximum length of ${VALIDATION_LIMITS.ARTICLE_MARKDOWN_MAX} characters`);
    }
}