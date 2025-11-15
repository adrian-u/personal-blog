import logger from "../utils/logger";
import { fetchWithAuth } from "./fetch-wrapper";

export async function uploadMarkdownImage(imageData) {
    const url = `${import.meta.env.VITE_API_URL}/uploads/image`;

    try {
        const res = await fetchWithAuth(url, {
            method: "POST",
            body: imageData
        });

        if (!res.ok) {
            logger("error", "Upload Markdown Image", "Failed to upload the markdown image");
            const details = await res.text();
            throw new Error(`Failed to upload the markdown image: ${details}`);
        }

        return await res.json();
    } catch (error) {
        logger("error", "Upload Markdown Image", error);
        throw error;
    }
}