import htmlImporter from "../../utils/html-importer";
import { closeModal, openReadModal } from "../../utils/modals";
import { MDParser } from "@pardnchiu/nanomd";
import logger from "../../utils/logger";
import { showToast } from "../../utils/toast";
import { getArticleForReading } from "../../apis/article";
import { getCurrentUser } from "../../context/user-context";
import { addCommentSection } from "./comment/add-comment-section";
import { commentsSection } from "./comment/comments-section";

const LOG_CONTEXT = "Read Article";

const LIMIT = 10;

export async function readArticle(id) {

    await _importReadModal();
    await _buildReadModal(id);

}

async function _importReadModal() {
    if (!document.getElementById("read-article-modal")) {
        await htmlImporter("body", "./src/components/read-article-modal.html");
    }
}

async function _buildReadModal(id) {

    try {
        const currentUser = await getCurrentUser();
        const article = await getArticleForReading(id);
        const modal = document.getElementById("read-article-modal");

        const modalContent = modal.querySelector("#article-read-content");
        modalContent.innerHTML = "";

        const headerRow = document.createElement("div");
        headerRow.classList.add("read-header");

        const titleDate = document.createElement("div");

        const title = document.createElement("h1");
        title.textContent = article.title;
        title.classList.add("card-title");
        titleDate.appendChild(title);

        const date = document.createElement("div");
        date.classList.add("card-date");
        date.textContent = new Date(article.createdAt).toLocaleDateString();
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

        modalContent.append(headerRow,
            articleContent,
            addCommentSection(id, currentUser),
            await commentsSection(id, currentUser));

        openReadModal();
    } catch (error) {
        logger("error", `${LOG_CONTEXT}`, error);
        showToast("Failed to load article", "error");
    }
}