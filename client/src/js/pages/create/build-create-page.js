import buildArticleMetadata from "./article-metadata";
import buildArticleEditor from "./article-editor";
import buildArticleWip, { renderArticle, setActiveWipArticle } from "./wip-article";
import htmlImporter from "../../utils/html-importer";
import { createArticle, getWipArticle, publishArticle, updateArticle } from "../../apis/article";
import { openArticlePreviewModal } from "../../utils/modals";
import { MDViewer } from "@pardnchiu/nanomd";
import { showToast } from "../../utils/toast";
import validateCreateArticleForm from "./form-validator";
import logger from "../../utils/logger";
import { isEmpty } from "../../utils/general";

const LOG_CONTEXT = "Build Create Page";

let mdEditor = null;
let mdViewer = null;


export default async function buildCreatePage() {

    await _createPreviewModal();
    buildArticleMetadata();
    mdEditor = buildArticleEditor();
    await buildArticleWip();

    const articleForm = document.getElementById("article-form");
    const previewButton = document.getElementById("preview");
    _saveEvent(document.getElementById("save"), articleForm);

    previewButton.addEventListener("click", (event) => {
        event.preventDefault();
        _preview(mdEditor);
    });
}

function _saveEvent(button, articleForm) {
    button.addEventListener("click", async (event) => {
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
            _fillArticleMetadata(createdArticle);
            _reloadArticleEditor(createdArticle.markdown);
            const saveButton = document.getElementById("save");
            const oldButton = document.getElementById("update");
            const newButton = oldButton.cloneNode(true);
            oldButton.replaceWith(newButton);

            saveButton.style = "display: none";
            newButton.style = "display: block";

            newButton.addEventListener('click', async (event) => {
                event.preventDefault();
                _updateArticle(createdArticle.id, {
                    title: createdArticle.title,
                    icon: createdArticle.icon,
                    category: createdArticle.category,
                    description: createdArticle.description,
                    markdown: createdArticle.markdown,
                });
            });

            const wipArticle = document.getElementById("wip-article");
            wipArticle.style = "display: flex";
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

        const saveButton = document.getElementById("save");
        const oldButton = document.getElementById("update");
        const publishButton = document.getElementById("publish");
        const newButton = oldButton.cloneNode(true);
        oldButton.replaceWith(newButton);

        saveButton.style = "display: none";
        newButton.style = "display: block";
        publishButton.style = "display: block";
        newButton.addEventListener("click", async (event) => {
            event.preventDefault();
            await _updateArticle(id, {
                title: article.title,
                icon: article.icon,
                category: article.category,
                description: article.description,
                markdown: article.markdown,
            });
        });

        publishButton.addEventListener("click", async () => {
            await _publishArticle(id);
        });

        showToast(`Loaded ${article.title}`, "success", 3000);
    } catch (error) {
        logger("error", `${LOG_CONTEXT} - "Loading WIP Data"`, error);
        showToast("Failed to load article", "error");
    }

}

async function _publishArticle(id) {
    try {
        await publishArticle(id);
    } catch (error) {
        logger("error", `${LOG_CONTEXT} - "Publish Article"`, error);
        showToast("Failed to publish the article", "error");
    }
}

async function _updateArticle(id, oldValues) {

    const formData = new FormData(document.getElementById("article-form"));
    const title = formData.get("article-title");
    const icon = formData.get("article-icon");
    const category = formData.get("article-category");
    const description = formData.get("article-description");
    const markdown = mdEditor?.text || "";

    const updates = [];

    if (title.trim() !== oldValues.title.trim()) updates.push({ "op": "update", "field": "title", "value": title });
    if (icon.trim() !== oldValues.icon.trim()) updates.push({ "op": "update", "field": "icon", "value": icon });
    if (category.trim() !== oldValues.category.trim()) updates.push({ "op": "update", "field": "category", "value": category });
    if (description.trim() !== oldValues.description.trim()) updates.push({ "op": "update", "field": "description", "value": description });
    if (markdown.trim() !== oldValues.markdown.trim()) updates.push({ "op": "update", "field": "markdown", "value": markdown });

    if (!isEmpty(updates)) {
        try {
            const updatedArticle = await updateArticle(id, updates);
            const oldBox = document.getElementById(id);
            if (oldBox) oldBox.replaceWith(renderArticle(updatedArticle));
            setActiveWipArticle(id);
            showToast("Article updated successfully", "success");
        } catch (err) {
            logger("error", `${LOG_CONTEXT} - Update`, err);
            showToast("Failed to update article", "error");
        }
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

    const iconSelected = document.getElementById("icon");
    iconSelected.querySelector('[class="selected"]').textContent = article.icon;
    const categorySelected = document.getElementById("category");
    categorySelected.querySelector('[class="selected"]').textContent = article.category;
}

function _reloadArticleEditor(content) {
    const editorContainer = document.getElementById('article-editor');
    editorContainer.innerHTML = "";

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

    if (!mdViewer) {
        mdViewer = new MDViewer({
            id: "article-preview-content",
            emptyContent: "",
            style: {
                mode: "",
                fill: "",
                fontFamily: "Inter",
            },
            sync: {
                editor: mdEditor,
                delay: 100,
                scrollSync: 1,
            },
            hashtag: {
                path: "?keyword=",
                target: "_blank"
            }
        })
    }


    openArticlePreviewModal();
}

async function _createPreviewModal() {
    await htmlImporter("body", "/components/article-preview-modal.html");
}