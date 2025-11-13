import { getJWT } from "../auth/auth";
import logger from "../utils/logger";

export async function uploadMarkdownImage(imageData) {
    const url = `${import.meta.env.VITE_API_URL}/uploads/image`;

    try {
        const res = await fetch(`${url}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${getJWT()}`
            },
            body: imageData
        });

        if (!res.ok) {
            logger("error", "Upload Markdown Image", "Failed to upload the markdown image");
            throw new Error("Failed to upload the markdown image");
        }
        return await res.json();
    } catch (error) {
        logger("error", `${LOG_CONTEXT} - ${LOCAL_LOG_CONTEXT}`, error);
        throw error;
    }
}