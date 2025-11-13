import { withErrorHandling } from "../middlewares/error-handler.js";
import { withAuthentication, withAuthorization } from "../middlewares/oauth.js";
import { registerRoute } from "./router.manager.js";
import { saveMarkdownImage, getImage } from "../controllers/image.controller.js";

registerRoute("POST", "/api/v1/uploads/image",
    withErrorHandling(
        withAuthentication(
            withAuthorization(saveMarkdownImage)))
);

registerRoute("GET", "/api/v1/images/:fileName",
    withErrorHandling(getImage)
);