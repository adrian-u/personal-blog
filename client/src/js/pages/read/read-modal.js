import htmlImporter from "../../utils/html-importer";
import { closeModal, openConfirmationModal, openReadModal } from "../../utils/modals";
import { MDParser } from "@pardnchiu/nanomd";
import DOMPurify from "dompurify";
import logger from "../../utils/logger";
import { showToast } from "../../utils/toast";
import { addArticleToFavorites, getArticleForReading, publishArticle, removeArticleFromFavorites } from "../../apis/article";
import { getCurrentUser } from "../../context/user-context";
import { addCommentSection } from "./comment/add-comment-section";
import { commentsSection } from "./comment/comments-section";
import star from "../../../assets/images/star.png";
import star_full from "../../../assets/images/star-full.png";
import { navigateTo } from "../../router/router";

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
        title.id = "read-modal-article-title"; 
        title.classList.add("card-title");
        titleDate.appendChild(title);

        modal.setAttribute("aria-labelledby", "read-modal-article-title");

        const date = document.createElement("time");
        date.classList.add("card-date");
        date.textContent = new Date(article.createdAt).toLocaleDateString();
        date.setAttribute("datetime", new Date(article.createdAt).toISOString());
        titleDate.appendChild(date);

        headerRow.appendChild(titleDate);

        const articleOptions = document.createElement("div");
        articleOptions.classList.add("article-options");
        headerRow.appendChild(articleOptions);

        const favoriteBtn = document.createElement("button");
        favoriteBtn.type = "button";
        favoriteBtn.classList.add("btn-icon");
        
        const favoriteIcon = document.createElement("img");
        favoriteIcon.classList.add("png");
        favoriteIcon.alt = "";
        
        if (currentUser) {
            const isInitiallyLiked = currentUser.likedArticles.includes(Number(id));
            _updateFavoriteButtonState(favoriteBtn, favoriteIcon, isInitiallyLiked);

            favoriteBtn.addEventListener("click", async (e) => {
                e.stopPropagation();
                try {
                    const isLiked = favoriteBtn.getAttribute("aria-pressed") === "true";
                    
                    if (isLiked) {
                        await removeArticleFromFavorites(id);
                        currentUser.likedArticles = currentUser.likedArticles.filter(aid => aid !== Number(id));
                        _updateFavoriteButtonState(favoriteBtn, favoriteIcon, false);
                    } else {
                        await addArticleToFavorites(id);
                        currentUser.likedArticles.push(Number(id));
                        _updateFavoriteButtonState(favoriteBtn, favoriteIcon, true);
                    }
                } catch (error) {
                    showToast("Failed to update favorite status", "error");
                    logger("error", `${LOG_CONTEXT}`, error);
                }
            });
        } else {
            favoriteIcon.src = star;
            favoriteBtn.disabled = true;
            favoriteBtn.setAttribute("aria-label", "Login to add to favorites");
        }

        favoriteBtn.appendChild(favoriteIcon);
        articleOptions.appendChild(favoriteBtn);

        const closeButton = document.createElement("button");
        closeButton.type = "button";
        closeButton.classList.add("btn", "btn-blue", "read");
        closeButton.textContent = "Close";
        closeButton.addEventListener("click", () => closeModal(modal));
        articleOptions.appendChild(closeButton);

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.classList.add("btn", "btn-green", "read",
            currentUser?.role === "creator"
                ? "show"
                : "remove-from-layout");
        editButton.textContent = "Private";
        editButton.addEventListener("click", async () => await _buildChangeArticleVisibilityModal(id, modal));
        articleOptions.appendChild(editButton);

        const domParser = new MDParser({ standard: 1 });
        
        const dirty = domParser.parse(article.markdown);
        const clean = DOMPurify.sanitize(dirty, {
            ALLOWED_TAGS: [
                "p", "h1", "h2", "h3", "h4", "h5", "h6",
                "strong", "em", "code", "pre",
                "ul", "ol", "li",
                "img", "blockquote", "br", "hr",
                "a",
                "table", "thead", "tbody", "tr", "td", "th"
            ],
            ALLOWED_ATTR: ["src", "alt", "class", "href", "target", "rel", "title"]
        });

        const tmp = document.createElement("div");
        tmp.innerHTML = clean;
        tmp.querySelectorAll("a[href]").forEach(a => {
            try {
                const href = a.getAttribute("href");
                if (/^https?:\/\//i.test(href)) {
                    a.setAttribute("target", "_blank");
                    a.setAttribute("rel", "noopener noreferrer");
                }
            } catch (e) {
            }
        });

        const finalClean = tmp.innerHTML;

        const articleContent = document.createElement("div");
        articleContent.classList.add("article-body");
        articleContent.innerHTML = clean;

        modalContent.append(
            headerRow,
            articleContent,
            currentUser ? addCommentSection(id, currentUser) : "",
            await commentsSection(id, currentUser)
        );

        openReadModal();

    } catch (error) {
        logger("error", `${LOG_CONTEXT}`, error);
        showToast("Failed to load article", "error");
    }
}

function _updateFavoriteButtonState(btn, img, isLiked) {
    img.src = isLiked ? star_full : star;
    btn.setAttribute("aria-label", isLiked ? "Remove from favorites" : "Add to favorites");
    btn.setAttribute("aria-pressed", isLiked ? "true" : "false");
}

async function _buildChangeArticleVisibilityModal(id, readModal) {
    const modalContainer = document.getElementById("confirmation-modal");
    modalContainer.classList.add("visibility");

    const contentModal = modalContainer.querySelector("#confirmation-content");
    contentModal.classList.add("modal-confirmation");
    
    const modalHeader = contentModal.querySelector("#conf-header");
    const modalText = contentModal.querySelector("#conf-text");
    const confirmButton = contentModal.querySelector("#confirm");
    const cancelButton = contentModal.querySelector("#cancel");

    modalHeader.textContent = "Make Private";
    modalText.innerHTML = `<span>Are you sure you want to make this article private?</span>`;

    confirmButton.onclick = async () => {
        try {
            await publishArticle(id);
            closeModal(readModal);
            navigateTo(window.location.href); 
        } catch (error) {
            logger("error", "Make the article private", `Failed to make article with id: [${id}] private`);
            showToast("Failed to make the article private", "error");
        } finally {
            closeModal(modalContainer);
        }
    };

    cancelButton.onclick = () => {
        closeModal(modalContainer);
    };

    openConfirmationModal();
}