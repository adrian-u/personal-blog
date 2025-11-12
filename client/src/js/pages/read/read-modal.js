import htmlImporter from "../../utils/html-importer";
import { closeModal, openReadModal } from "../../utils/modals";
import { MDParser } from "@pardnchiu/nanomd";
import logger from "../../utils/logger";
import { showToast } from "../../utils/toast";
import { addArticleToFavorites, getArticleForReading, removeArticleFromFavorites } from "../../apis/article";
import { getCurrentUser } from "../../context/user-context";
import { addCommentSection } from "./comment/add-comment-section";
import { commentsSection } from "./comment/comments-section";
import star from "../../../assets/images/star.png";
import star_full from "../../../assets/images/star-full.png";

const LOG_CONTEXT = "Read Article";

export async function readArticle(id) {

    await _importReadModal();
    await _buildReadModal(id);

}

async function _importReadModal() {
    if (!document.getElementById("read-article-modal")) {
        await htmlImporter("body", "/components/read-article-modal.html");
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

        const articleOptions = document.createElement("div");
        articleOptions.classList.add("article-options");
        headerRow.appendChild(articleOptions);

        const favoriteIcon = document.createElement("img");
        favoriteIcon.classList.add("png")
        if (currentUser) {
            favoriteIcon.src = currentUser.likedArticles.includes(Number(id)) ? star_full : star;
            favoriteIcon.addEventListener("click", async (e) => {
                e.stopPropagation();

                try {
                    const isLiked = currentUser.likedArticles.includes(Number(id));
                    if (isLiked) {
                        await removeArticleFromFavorites(id);
                        currentUser.likedArticles = currentUser.likedArticles.filter(aid => aid !== Number(id));
                        favoriteIcon.src = star;
                    } else {
                        await addArticleToFavorites(id);
                        currentUser.likedArticles.push(Number(id));
                        favoriteIcon.src = star_full;
                    }
                } catch (error) {
                    showToast("Failed to update favorite status", "error");
                    logger("error", `${LOG_CONTEXT}`, error);
                }
            })
        } else {
            favoriteIcon.src = star;
        }

        articleOptions.appendChild(favoriteIcon);

        const closeButton = document.createElement("button");
        closeButton.classList.add("btn", "btn-blue", "close");
        closeButton.textContent = "Close";
        closeButton.onclick = () => closeModal(modal);
        articleOptions.appendChild(closeButton)

        const domParser = new MDParser({
            standard: 1
        });

        const articleContent = document.createElement("p");
        articleContent.classList.add("article-body")
        articleContent.innerHTML = domParser.parse(article.markdown);

        modalContent.append(headerRow,
            articleContent,
            currentUser ? addCommentSection(id, currentUser) : "",
            await commentsSection(id, currentUser));

        openReadModal();
    } catch (error) {
        logger("error", `${LOG_CONTEXT}`, error);
        showToast("Failed to load article", "error");
    }
}