import buildArticleMetadata from "./article-metadata";
import buildArticleEditor from "./article-editor";
import buildArticleWip from "./wip-article";
import htmlImporter from "../../utils/html-importer";
import { createArticle } from "../../apis/article";
import { openArticlePreviewModal } from "../../utils/modals";
import { MDViewer } from "@pardnchiu/nanomd";
import { showToast } from "../../utils/toast";
import validateCreateArticleForm from "./form-validator";

export default async function buildCreatePage() {

    await _createPreviewModal();
    buildArticleMetadata();
    const mdEditor = buildArticleEditor();
    await buildArticleWip();
    const articleForm = document.getElementById("article-form");

    const previewButton = document.getElementById("preview");
    _saveEvent(document.getElementById("save"), articleForm, mdEditor);

    previewButton.addEventListener('click', (event) => {
        event.preventDefault();
        _preview(mdEditor);
    });
}

function _saveEvent(button, articleForm, mdEditor) {
    button.addEventListener('click', async (event) => {
        event.preventDefault();
        const formData = new FormData(articleForm);
        const title = formData.get("article-title");
        const icon = formData.get("article-icon");
        const category = formData.get("article-category");
        const description = formData.get("article-description");
        const markdown = mdEditor.text;

        const json = _formToJson(title, icon, category, description, markdown);

        const invalidFields = validateCreateArticleForm({ title, icon, category, description, markdown });
        if (invalidFields.length > 0) {
            showToast(`The following fields are empty: [${invalidFields.join(" ")}]`, "error");
            return;
        }

        try {
            await createArticle(json);
        } catch (error) {
            showToast("Failed to save article", "error");
        }
    });
}

function _formToJson(title, icon, category, description, text) {
    return {
        "title": title,
        "icon": icon,
        "category": category,
        "description": description,
        "markdown": text
    };
}

function _preview(mdEditor) {

    const domViewer = new MDViewer({
        id: "article-preview-content",
        emptyContent: "",
        style: {
            mode: "",
            fill: "",
            fontFamily: "Inter",
        },
        sync: {
            editor: mdEditor,
            delay: 50,
            scrollSync: 1,
        },
        hashtag: {
            path: "?keyword=",
            target: "_blank"
        }
    })

    openArticlePreviewModal();
}

async function _createPreviewModal() {
    await htmlImporter("body", "./src/components/article-preview-modal.html");
}