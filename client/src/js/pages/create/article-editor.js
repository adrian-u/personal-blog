import { MDEditor } from "@pardnchiu/nanomd";
import { uploadMarkdownImage } from "../../apis/images";
import logger from "../../utils/logger";
import { showToast } from "../../utils/toast";

export default function buildArticleEditor(content = "") {

    const articleEditor = document.getElementById('article-editor');

    const nanomdWrapperDiv = document.createElement("div");
    nanomdWrapperDiv.className = "nanomd-wrapper";

    const editorContainer = document.createElement("div");
    editorContainer.id = "nanomd-editor";

    articleEditor.appendChild(nanomdWrapperDiv);

    nanomdWrapperDiv.appendChild(editorContainer);

    const domEditor = new MDEditor({
        id: "nanomd-editor",
        defaultContent: content,
        hotKey: 1,
        preventRefresh: 0,
        tabPin: 1,
        wrap: 1,
        autosave: 1,
        event: {
            upload: async () => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";

                const file = await new Promise((resolve) => {
                    input.onchange = () => resolve(input.files[0]);
                    input.click();
                });

                if (!file) return null;

                const formData = new FormData();
                formData.append("file", file);

                try {
                    const data = await uploadMarkdownImage(formData);
                    showToast("Image uploaded successfully!", "success");
                    return {
                        href: data.href,
                        alt: data.alt
                    };
                } catch (error) {
                    logger("error", "Markdown Editor Upload Image", `Failed to upload: ${error}`);
                    showToast("Failed to upload the image", "error");
                    return null;
                }
            }
        },
        style: {
            mode: "dark",
            fill: 0,
            fontFamily: "Inter",
            focus: {
                backgroundColor: "var(--color-primary-background)",
                color: "var(--color-primary)"
            }

        }
    });

    return domEditor;
}