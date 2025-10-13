import { isEmpty } from "./general.js";
import logger from "./logger.js";
import { ArticleValidationError } from "../errors/custom-errors.js";

const LOG_CONTEXT = "Article Utils";

/**
 * Checks if the JSON body for the creation and saving of the article is valid.
 * 
 * @memberof article-utils
 * @param {Object} article - Article data to validate.
 * @param {string} article.title
 * @param {string} article.icon
 * @param {string} article.category
 * @param {string} article.description
 * @param {string} article.markdown
 * @param {string} traceId random generated UUID to track the request flow with logs.
 * @throws {ArticleValidationError} If any required field is missing.
 * @returns {void}
 */
export function checkIfArticleBodyIsValid(article, traceId) {
    const LOCAL_LOG_CONTEXT = "Body Validation";

    logger("debug", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Validation of body: ${JSON.stringify(article, null, 4)}`);
    const FIELDS = ["title", "icon", "category", "description", "markdown"];
    const invalidFields = FIELDS.filter(field => isEmpty(article[field]));
    logger("debug", traceId, `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, `Invalid fields array: [${invalidFields.join(", ")}]`)

    if (invalidFields.length > 0) {
        throw new ArticleValidationError(`The required fields: [${invalidFields.join(", ")}] are not present`);
    }
}