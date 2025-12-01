import { getCurrentUser } from "../../context/user-context.js";
import { addArticleToFavorites, getArticleForReading, publishArticle, removeArticleFromFavorites } from "../../apis/article.js";
import { MDParser } from "@pardnchiu/nanomd";
import DOMPurify from "dompurify";
import logger from "../../utils/logger.js";
import { showToast } from "../../utils/toast.js";
import { openConfirmationModal, closeModal } from "../../utils/modals.js";
import { navigateTo } from "../../router/router.js";
import { addCommentSection } from "./comment/add-comment-section.js";
import { commentsSection } from "./comment/comments-section.js";
import star from "../../../assets/images/star.png";
import star_full from "../../../assets/images/star-full.png";

const LOG_CONTEXT = "Article Page";

export default async function buildArticlePage(articleId) {
    try {
        const currentUser = await getCurrentUser();
        const article = await getArticleForReading(articleId);
        const container = document.getElementById("article-view");

        const header = document.createElement("div");
        header.classList.add("article-page-header");

        const titleDate = document.createElement("div");
        const title = document.createElement("h1");
        title.textContent = article.title;
        title.id = "article-page-title";
        titleDate.appendChild(title);

        const date = document.createElement("time");
        date.classList.add("article-page-date");
        date.textContent = new Date(article.createdAt).toLocaleDateString();
        date.setAttribute("datetime", new Date(article.createdAt).toISOString());
        titleDate.appendChild(date);

        header.appendChild(titleDate);

        const articleOptions = document.createElement("div");
        articleOptions.classList.add("article-page-options");
        header.appendChild(articleOptions);

        const favoriteBtn = document.createElement("button");
        favoriteBtn.type = "button";
        favoriteBtn.classList.add("btn-icon");
        favoriteBtn.setAttribute("aria-label", "Add to favorites");

        const favoriteIcon = document.createElement("img");
        favoriteIcon.classList.add("png");
        favoriteIcon.alt = "";

        if (currentUser) {
            const isInitiallyLiked = currentUser.likedArticles.includes(Number(articleId));
            _updateFavoriteButtonState(favoriteBtn, favoriteIcon, isInitiallyLiked);

            favoriteBtn.addEventListener("click", async (e) => {
                e.stopPropagation();
                try {
                    const isLiked = favoriteBtn.getAttribute("aria-pressed") === "true";

                    if (isLiked) {
                        await removeArticleFromFavorites(articleId);
                        currentUser.likedArticles = currentUser.likedArticles.filter(aid => aid !== Number(articleId));
                        _updateFavoriteButtonState(favoriteBtn, favoriteIcon, false);
                    } else {
                        await addArticleToFavorites(articleId);
                        currentUser.likedArticles.push(Number(articleId));
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

        const shareBtn = document.createElement("button");
        shareBtn.type = "button";
        shareBtn.classList.add("btn", "btn-neutral", "article-page");
        shareBtn.textContent = "Share";
        shareBtn.setAttribute("aria-label", "Copy article link");
        shareBtn.addEventListener("click", async (e) => {
            e.stopPropagation();
            const url = window.location.href;
            try {
                await navigator.clipboard.writeText(url);
                showToast("Article link copied to clipboard!", "success");
            } catch (error) {
                showToast("Failed to copy link to clipboard", "error");
                logger("error", `${LOG_CONTEXT}`, error);
            }
        });
        articleOptions.appendChild(shareBtn);

        if (currentUser?.role === "creator") {
            const editBtn = document.createElement("button");
            editBtn.type = "button";
            editBtn.classList.add("btn", "btn-green", "article-page");
            editBtn.textContent = "Edit";
            editBtn.addEventListener("click", async () => {
                await _buildChangeArticleVisibilityModal(articleId);
            });
            articleOptions.appendChild(editBtn);
        }

        const backBtn = document.createElement("button");
        backBtn.type = "button";
        backBtn.classList.add("btn", "btn-blue", "article-page");
        backBtn.textContent = "Back";
        backBtn.addEventListener("click", () => {
            window.history.back();
        });
        articleOptions.appendChild(backBtn);

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
                if (href.startsWith("/article/")) {
                    a.setAttribute("data-nav", "spa");
                } else if (/^https?:\/\//i.test(href)) {
                    a.setAttribute("target", "_blank");
                    a.setAttribute("rel", "noopener noreferrer");
                }
            } catch (e) {
            }
        });

        const articleContent = document.createElement("div");
        articleContent.classList.add("article-page-body");
        articleContent.innerHTML = tmp.innerHTML;

        container.innerHTML = "";
        container.appendChild(header);
        container.appendChild(articleContent);

        if (currentUser) {
            container.appendChild(addCommentSection(articleId, currentUser));
        }
        container.appendChild(await commentsSection(articleId, currentUser));

    } catch (error) {
        logger("error", `${LOG_CONTEXT}`, error);
        showToast("Failed to load article", "error");
        const container = document.getElementById("article-view");
        container.innerHTML = "<p>Error loading article. Please try again.</p>";
    }
}

function _updateFavoriteButtonState(btn, img, isLiked) {
    img.src = isLiked ? star_full : star;
    btn.setAttribute("aria-label", isLiked ? "Remove from favorites" : "Add to favorites");
    btn.setAttribute("aria-pressed", isLiked ? "true" : "false");
}

async function _buildChangeArticleVisibilityModal(articleId) {
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
            await publishArticle(articleId);
            closeModal(modalContainer);
            navigateTo("/");
        } catch (error) {
            logger("error", "Make the article private", `Failed to make article with id: [${articleId}] private`);
            showToast("Failed to make the article private", "error");
        }
    };

    cancelButton.onclick = () => {
        closeModal(modalContainer);
    };

    openConfirmationModal();
}
