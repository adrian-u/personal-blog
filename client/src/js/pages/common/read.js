import htmlImporter from "../../utils/html-importer";
import { closeModal, openConfirmationModal, openReadModal } from "../../utils/modals";
import { MDParser } from "@pardnchiu/nanomd";
import logger from "../../utils/logger";
import { showToast } from "../../utils/toast";
import { getArticleForReading } from "../../apis/article";
import anonymous from '../../../assets/images/anonymous.png';
import { publishComment, getParentComments, deleteCommentByOwnerOrCreator } from "./comment-common";
import { isEmpty } from "../../utils/general";
import { getCurrentUser } from "../../context/user-context";

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
        date.textContent = new Date(article.created_at).toLocaleDateString();
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
        modalContent.appendChild(_createAddCommentSection(id, currentUser));
        const commentsSection = await _createViewCommentsSection(id, currentUser);
        modalContent.appendChild(commentsSection);

        openReadModal();
    } catch (error) {
        logger("error", `${LOG_CONTEXT}`, error);
        showToast("Failed to load article", "error");
    }
}

function _createAddCommentSection(articleId, currentUser) {

    const addCommentRow = document.createElement("div");
    addCommentRow.classList.add("create-comment-row");

    const userAvatar = document.createElement("img");
    userAvatar.classList.add("comment-avatar");
    userAvatar.src = anonymous;

    const commentText = document.createElement("textarea");
    commentText.classList.add("comment-text-area");
    commentText.placeholder = "Say what you think!";

    const commentButton = document.createElement("button");
    commentButton.classList.add("btn", "btn-blue", "publish", "remove-from-layout");
    commentButton.textContent = "Publish";
    commentButton.disabled = true;
    commentText.addEventListener("input", () => {
        const value = commentText.value.trim();
        commentButton.disabled = !value;
        if (value) {
            commentButton.classList.remove("remove-from-layout");
        } else {
            commentButton.classList.add("remove-from-layout");
        }
    });
    commentButton.onclick = async () => {

        const newComment = await publishComment(commentText.value, articleId);
        if (!newComment) return;

        commentText.value = "";

        const commentsSection = document.querySelector(".parent-comment-section");

        if (commentsSection) {
            const newCommentBox = _buildCommentBox(newComment, currentUser);
            newCommentBox.classList.add("new");
            commentsSection.prepend(newCommentBox);
        }
    };

    addCommentRow.appendChild(userAvatar);
    addCommentRow.appendChild(commentText);
    addCommentRow.appendChild(commentButton);

    return addCommentRow;
}

async function _createViewCommentsSection(articleId, currentUser) {

    let offset = 0;

    const parentComments = await getParentComments(articleId, LIMIT, offset);

    const parentCommentsSection = document.createElement("div");
    parentCommentsSection.classList.add("parent-comment-section");
    if (parentComments.comments.length > 0) {
        parentComments.comments.forEach(parentComment => {
            parentCommentsSection.appendChild(_buildCommentBox(parentComment, currentUser));
        });
    }

    const loadMore = document.createElement("div");
    loadMore.id = "load-more-comments";
    loadMore.classList.add("btn", "btn-blue");
    loadMore.textContent = "Load More";
    if (offset + LIMIT >= parentComments.totalCount) {
        loadMore.classList.add("hidden");
    }
    loadMore.onclick = async () => {
        offset += LIMIT;
        const parentComments = await getParentComments(articleId, LIMIT, offset);

        if (parentComments.comments.length > 0) {
            parentComments.comments.forEach(parentComment => {
                const newComment = _buildCommentBox(parentComment, currentUser);
                parentCommentsSection.insertBefore(newComment, loadMore);
            });

            if (offset + LIMIT >= parentComments.totalCount) {
                loadMore.classList.add("hidden");
            }
        }
    };

    if (parentComments.totalCount > LIMIT) {
        parentCommentsSection.appendChild(loadMore);
    }

    return parentCommentsSection;
}

function _buildCommentBox(comment, currentUser) {

    const author = comment.author ?? { name: "Anonymous", avatar: anonymous };

    const commentBox = document.createElement("div");
    commentBox.classList.add("comment-box");
    commentBox.id = comment.id;

    const userAvatar = document.createElement("img");
    userAvatar.classList.add("comment-avatar");
    userAvatar.src = /*author.avatar || */ anonymous;
    commentBox.appendChild(userAvatar);

    const commentData = document.createElement("div");
    commentData.classList.add("comment-data");

    const infoRow = document.createElement("div");
    infoRow.classList.add("comment-info-row");

    const username = document.createElement("p");
    username.textContent = author.name;
    infoRow.appendChild(username);

    const dateDeleteRow = document.createElement("div");
    dateDeleteRow.classList.add("date-delete-row");

    const commentDate = document.createElement("p");
    commentDate.classList.add("comment-date");
    commentDate.textContent = new Date(comment.createdAt).toLocaleDateString();

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-btn", currentUser.id === comment.userId || currentUser.role === "creator" ? "show" : "hidden");
    deleteButton.disabled = currentUser.id === comment.userId || currentUser.role === "creator" ? false : true;
    deleteButton.textContent = "✕";

    deleteButton.addEventListener("click", (e) => {
        e.stopPropagation();
        _buildDeleteConfirmationModal(comment);
        openConfirmationModal();
    });

    dateDeleteRow.append(commentDate, deleteButton);

    infoRow.appendChild(dateDeleteRow);
    commentData.appendChild(infoRow);

    const commentContent = document.createElement("p");
    commentContent.textContent = comment.content;
    commentContent.classList.add("comment-content");
    commentData.appendChild(commentContent);

    const commentBoxFooter = document.createElement("div");
    commentBoxFooter.classList.add("comment-footer");

    const reply = document.createElement("div");
    reply.classList.add("comment-reply-btn");
    reply.textContent = "Reply";
    reply.onclick = () => alert("TODO: Implement Reply Logic");
    commentBoxFooter.appendChild(reply);

    const showReplies = document.createElement("p");
    showReplies.classList.add("show-replies");
    showReplies.textContent = "View Replies";
    commentBoxFooter.appendChild(showReplies);

    commentData.appendChild(commentBoxFooter);
    commentBox.appendChild(commentData);

    return commentBox;
}

function _buildDeleteConfirmationModal(comment) {
    const modalContainer = document.getElementById("confirmation-modal");
    modalContainer.classList.add("visibility");
    const contentModal = modalContainer.querySelector("#confirmation-content");
    contentModal.classList.add("modal-confirmation");

    const modalHeader = contentModal.querySelector("#conf-header");
    const modalText = contentModal.querySelector("#conf-text");
    const confirmButton = contentModal.querySelector("#confirm");
    const cancelButton = contentModal.querySelector("#cancel");

    modalHeader.textContent = "Confirm Deletion";
    modalText.innerHTML = `
        <span>Are you sure you want to delete the comment:
        <br> 
        <strong class="modal-conf-title">${comment.content}</strong>?</span>
        <br>
        <span class="delete-subtext">This action cannot be undone.</span>`

    confirmButton.onclick = async () => {
        try {
            await deleteCommentByOwnerOrCreator(comment.id);
            document.getElementById(comment.id)?.remove();
            closeModal(modalContainer);
            showToast("Article deleted", "success");
        } catch (err) {
            logger("error", "WIP-Delete Article", `Failed to delete the wip article with id: [${id}]. Error: [${err}]`);
            showToast("Failed to delete article", "error");
        }
    };

    cancelButton.onclick = () => closeModal(modalContainer);
}
