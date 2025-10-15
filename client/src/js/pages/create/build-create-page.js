import buildArticleMetadata from "./article-metadata";
import buildArticleEditor from "./article-editor";
import buildArticleWip, { renderArticle } from "./wip-article";
import htmlImporter from "../../utils/html-importer";
import { createArticle, getWipArticle } from "../../apis/article";
import { openArticlePreviewModal } from "../../utils/modals";
import { MDViewer } from "@pardnchiu/nanomd";
import { showToast } from "../../utils/toast";
import validateCreateArticleForm from "./form-validator";
import logger from "../../utils/logger";

const LOG_CONTEXT = "Build Create Page";

let mdEditor = null;

export default async function buildCreatePage() {

    await _createPreviewModal();
    buildArticleMetadata();
    mdEditor = buildArticleEditor();
    await buildArticleWip();
    const articleForm = document.getElementById("article-form");

    const previewButton = document.getElementById("preview");
    _saveEvent(document.getElementById("save"), articleForm);

    previewButton.addEventListener('click', (event) => {
        event.preventDefault();
        _preview(mdEditor);
    });
}

function _saveEvent(button, articleForm) {
    button.addEventListener('click', async (event) => {
        event.preventDefault();
        const formData = new FormData(articleForm);
        const title = formData.get("article-title");
        const icon = formData.get("article-icon");
        const category = formData.get("article-category");
        const description = formData.get("article-description");
        const markdown = mdEditor?.text || "";

        const json = _formToJson(title, icon, category, description, markdown);

        const invalidFields = validateCreateArticleForm({ title, icon, category, description, markdown });
        if (invalidFields.length > 0) {
            showToast(`The following fields are empty: [${invalidFields.join(" ")}]`, "error");
            return;
        }

        try {
            const createdArticle = await createArticle(json);
            showToast("Article created successfully", "success");
            const wipArticle = document.getElementById("wip-article");
            const newArticleBox = renderArticle(createdArticle);
            wipArticle.appendChild(newArticleBox);
        } catch (error) {
            logger("error", `${LOG_CONTEXT}`, error);
            showToast("Failed to save article", "error");
        }
    });
}

export async function loadWipArticle(id) {

    try {
        const article = await getWipArticle(id);
        _fillArticleMetadata(article);
        _reloadArticleEditor(article.markdown);
        showToast(`Loaded ${article.title}`, "success", 3000);
    } catch (error) {
        logger("error", `${LOG_CONTEXT} - "Loading WIP Data"`, error);
        showToast("Failed to load article", "error");
    }

}

function _fillArticleMetadata(article) {
    const form = document.getElementById("article-form");
    if (!form) return;


    const titleInput = form.querySelector('[name="article-title"]');
    const iconInput = form.querySelector('[name="article-icon"]');
    const categorySelect = form.querySelector('[name="article-category"]');
    const descriptionInput = form.querySelector('[name="article-description"]');

    titleInput.value = article.title || "";
    iconInput.value = article.icon || "";
    categorySelect.value = article.category || "";
    descriptionInput.value = article.description || "";
}

function _reloadArticleEditor(content) {
    const editorContainer = document.getElementById('article-editor');
    editorContainer.innerHTML = '';

    mdEditor = buildArticleEditor(content);
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