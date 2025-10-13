import logger from "../../utils/logger";
import { isEmpty } from "../../utils/general";

export default function validateCreateArticleForm(data) {
    const FIELDS = ["title", "icon", "category", "description", "markdown"];

    const invalidFields = FIELDS.filter(field => isEmpty(data[field]));

    if (invalidFields.length > 0) {
        logger("error", "Form Data Validation", `Invalid fields: [${invalidFields.join(" ")}]`);
    }

    return invalidFields;
}