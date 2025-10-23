import htmlImporter from "../../utils/html-importer";
import { closeModal, openReadModal } from "../../utils/modals";
import { MDParser } from "@pardnchiu/nanomd";
import logger from "../../utils/logger";
import { showToast } from "../../utils/toast";
import { getArticleForReading } from "../../apis/article";

const LOG_CONTEXT = "Read Article Creation";

export async function readArticle(id) {

    await _importReadModal();
    await _buildReadModal(id);

}

async function _importReadModal() {
    await htmlImporter("body", "./src/components/read-article-modal.html");
}

async function _buildReadModal(id) {

    try {
        const article = await getArticleForReading(id);
        const modal = document.getElementById("read-article-modal");

        const modalContent = modal.querySelector("#article-read-content");

        while (modalContent.hasChildNodes()) {
            modalContent.firstChild.remove();
        }

        const headerRow = document.createElement("div");
        headerRow.classList.add("read-header");

        const titleDate = document.createElement("div");

        const title = document.createElement("h1");
        title.textContent = article.title;
        title.classList.add("card-title");
        titleDate.appendChild(title);

        const date = document.createElement("div");
        date.classList.add("card-date");
        date.textContent = new Date(article.created_at).toISOString().split("T")[0];
        titleDate.appendChild(date);

        headerRow.appendChild(titleDate);

        const closeButton = document.createElement("button");
        closeButton.classList.add("btn", "btn-blue", "close");
        closeButton.textContent = "Close";
        closeButton.onclick = () => closeModal(modal);
        headerRow.appendChild(closeButton)

        const domParser = new MDParser({
            standard: 1
        });

        const articleContent = document.createElement("p");
        articleContent.classList.add("article-body")
        articleContent.innerHTML = domParser.parse(article.markdown);

        modalContent.appendChild(headerRow);
        modalContent.appendChild(articleContent);

        openReadModal();
    } catch (error) {
        logger("error", `${LOG_CONTEXT}`, error);
        showToast("Failed to load article", "error");
    }
}