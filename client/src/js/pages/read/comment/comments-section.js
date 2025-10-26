import anonymous from "../../../../assets/images/anonymous.png";
import { fetchReplies } from "../../../apis/comment";
import { isEmpty } from "../../../utils/general";
import logger from "../../../utils/logger";
import { closeModal, openConfirmationModal } from "../../../utils/modals";
import { showToast } from "../../../utils/toast";
import { deleteCommentByOwnerOrCreator, getParentComments, publishComment } from "./comment-common";

const LIMIT = 10;

export async function commentsSection(articleId, currentUser) {
    let offset = 0;
    const commentsSection = document.createElement("div");
    commentsSection.classList.add("comments-section");

    const parentComments = await getParentComments(articleId, LIMIT, offset);

    if (!isEmpty(parentComments)) {
        parentComments.comments.forEach((parentComment, index) => {
            const commentBox = buildComment(parentComment, currentUser, articleId);
            commentsSection.appendChild(commentBox);

            if (index < parentComments.comments.length - 1) {
                const divider = document.createElement("div");
                divider.classList.add("divider");
                commentsSection.appendChild(divider);
            }
        });
    }

    const loadMore = document.createElement("button");
    loadMore.id = "load-more-comments";
    loadMore.classList.add("btn", "btn-green");
    loadMore.textContent = "Load More";

    if (offset + LIMIT >= parentComments.totalCount) {
        loadMore.classList.add("hidden");
    }

    commentsSection.appendChild(loadMore);

    loadMore.onclick = async () => {
        offset += LIMIT;
        const nextBatch = await getParentComments(articleId, LIMIT, offset);

        if (!isEmpty(nextBatch)) {
            nextBatch.comments.forEach(parentComment => {
                const divider = document.createElement("div");
                divider.classList.add("divider");
                commentsSection.insertBefore(divider, loadMore);

                const commentBox = buildComment(parentComment, currentUser, articleId);
                commentsSection.insertBefore(commentBox, loadMore);
            });

            if (offset + LIMIT >= nextBatch.totalCount) {
                loadMore.classList.add("hidden");
            }
        }
    };

    return commentsSection;
}

export function buildComment(comment, currentUser, articleId, isReply = false) {
    const commentDiv = document.createElement("div");
    commentDiv.classList.add(isReply ? "reply" : "comment");
    commentDiv.id = `comment-${comment.id}`;

    const commentContent = document.createElement("div");
    commentContent.classList.add("comment-content");
    commentContent.textContent = comment.content;

    commentDiv.append(
        _buildCommentHeader(comment, currentUser),
        commentContent,
        _buildCommentActions(comment, currentUser, articleId, isReply)
    );

    return commentDiv;
}

function _buildCommentHeader(comment, currentUser) {
    const author = comment.author ?? { name: "Anonymous", avatar: anonymous, role: "Creator" };
    author.avatar = anonymous;

    const commentHeader = document.createElement("div");
    commentHeader.classList.add("comment-header");

    const commentAuthor = document.createElement("div");
    commentAuthor.classList.add("comment-author");

    const avatar = document.createElement("img");
    avatar.classList.add("comment-avatar");
    avatar.src = author.avatar;

    const userInfo = document.createElement("div");

    const authorName = document.createElement("div");
    authorName.innerHTML = `<div class="comment-author-name">${author.name} ${author.role === "creator"
        ? '<span class="comment-badge">Creator</span>'
        : '<span class="comment-badge">User</span>'}</div>`;

    const commentDate = document.createElement("div");
    commentDate.classList.add("comment-date");
    commentDate.textContent = new Date(comment.createdAt).toLocaleDateString();

    userInfo.append(authorName, commentDate);
    commentAuthor.append(avatar, userInfo);

    commentHeader.append(commentAuthor, _buildCommentDelete(comment, currentUser));

    return commentHeader;
}

function _buildCommentDelete(comment, currentUser) {
    const commentDelete = document.createElement("div");
    commentDelete.classList.add("comment-delete");

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-btn", currentUser.id === comment.userId || currentUser.role === "creator" ? "show" : "hidden");
    deleteButton.disabled = !(currentUser.id === comment.userId || currentUser.role === "creator");
    deleteButton.textContent = "✕";

    deleteButton.addEventListener("click", (e) => {
        e.stopPropagation();
        _buildDeleteConfirmationModal(comment);
        openConfirmationModal();
    });

    commentDelete.appendChild(deleteButton);

    return commentDelete;
}

function _buildCommentActions(comment, currentUser, articleId) {
    const commentActions = document.createElement("div");
    commentActions.classList.add("comment-actions");

    const replyButton = document.createElement("button");
    replyButton.classList.add("action-btn");
    replyButton.textContent = "↩ Reply";
    replyButton.onclick = () => {
        const commentElement = document.getElementById(`comment-${comment.id}`);

        const existingReplyForm = commentElement.nextElementSibling?.classList.contains("reply-form")
            ? commentElement.nextElementSibling
            : null;

        if (existingReplyForm) {
            existingReplyForm.remove();
            return;
        }

        document.querySelectorAll(".reply-form").forEach(form => form.remove());

        const replyForm = _replyForm(comment, currentUser, articleId);
        commentElement.insertAdjacentElement("afterend", replyForm);
    };

    const likeButton = document.createElement("button");
    likeButton.classList.add("action-btn");
    likeButton.textContent = "👍 12";

    const showReplies = document.createElement("button");
    showReplies.classList.add("action-btn", "show-replies-btn");
    showReplies.textContent = "💬 Show Replies";
    showReplies.onclick = async (e) => {
        const commentElement = document.getElementById(`comment-${comment.id}`);

        let repliesSection = null;
        let currentElement = commentElement.nextElementSibling;

        if (currentElement?.classList.contains("reply-form")) {
            currentElement = currentElement.nextElementSibling;
        }

        if (currentElement?.classList.contains("replies")) {
            repliesSection = currentElement;
        }

        if (repliesSection) {
            repliesSection.remove();
            showReplies.textContent = "💬 Show Replies";
            return;
        }

        try {
            const replies = await _repliesSection(comment.id, currentUser, articleId);
            if (replies && replies.childNodes.length > 0) {
                const insertAfter = commentElement.nextElementSibling?.classList.contains("reply-form")
                    ? commentElement.nextElementSibling
                    : commentElement;

                insertAfter.insertAdjacentElement("afterend", replies);
                showReplies.textContent = "💬 Hide Replies";
            } else {
                showToast("No replies yet", "info");
            }
        } catch (error) {
            logger("error", "Show Replies", `Failed to show replies. Error: ${error}`);
            showToast("Failed to load replies", "error");
        }
    };

    commentActions.append(replyButton, likeButton, showReplies);

    return commentActions;
}

async function _repliesSection(id, currentUser, articleId) {
    const replies = document.createElement("div");
    replies.classList.add("replies");

    let offset = 0;
    try {
        const { totalCount, comments: retrievedReplies } = await fetchReplies(id, LIMIT, offset);

        if (!retrievedReplies || retrievedReplies.length === 0) {
            return null;
        }

        retrievedReplies.forEach(reply => {
            replies.appendChild(buildComment(reply, currentUser, articleId, true));
        });

        return replies;
    } catch (error) {
        logger("error", "Fetch replies", `Failed to fetch replies for comment with id: [${id}]. Error: [${error}]`);
        throw error;
    }
}

function _replyForm(comment, currentUser, articleId) {
    const replyForm = document.createElement("div");
    replyForm.classList.add("reply-form");

    const commentHeader = document.createElement("div");
    commentHeader.classList.add("add-comment-header");

    const avatar = document.createElement("img");
    avatar.classList.add("comment-avatar");
    avatar.src = anonymous;

    const commentLabel = document.createElement("div");
    commentLabel.classList.add("add-comment-label");
    commentLabel.textContent = `Reply to ${comment.author?.name || "Anonymous"}`;

    commentHeader.append(avatar, commentLabel);

    const content = document.createElement("textarea");
    content.placeholder = "Write your reply...";
    content.style.minHeight = "80px";

    const commentFooter = document.createElement("div");
    commentFooter.classList.add("add-comment-footer");

    const cancelButton = document.createElement("button");
    cancelButton.classList.add("btn", "btn-neutral");
    cancelButton.textContent = "Cancel";
    cancelButton.onclick = () => {
        replyForm.remove();
    };

    const postButton = document.createElement("button");
    postButton.classList.add("btn", "btn-green", "remove-from-layout");
    postButton.textContent = "Post Reply";
    postButton.disabled = true;

    content.addEventListener("input", () => {
        const value = content.value.trim();
        postButton.disabled = !value;
        if (value) {
            postButton.classList.remove("remove-from-layout");
        } else {
            postButton.classList.add("remove-from-layout");
        }
    });

    postButton.onclick = async () => {
        try {
            const newReply = await publishComment({
                content: content.value,
                isReply: true,
                parentId: comment.id
            }, articleId);

            replyForm.remove();

            const commentElement = document.getElementById(`comment-${comment.id}`);
            let repliesSection = null;
            let currentElement = commentElement.nextElementSibling;

            if (currentElement?.classList.contains("replies")) {
                repliesSection = currentElement;
            }

            if (!repliesSection) {
                repliesSection = document.createElement("div");
                repliesSection.classList.add("replies");
                commentElement.insertAdjacentElement("afterend", repliesSection);

                const showRepliesBtn = commentElement.querySelector(".show-replies-btn");
                if (showRepliesBtn) {
                    showRepliesBtn.textContent = "💬 Hide Replies";
                }
            }

            const newReplyElement = buildComment(newReply, currentUser, articleId, true);
            newReplyElement.classList.add("new");
            repliesSection.prepend(newReplyElement);

            showToast("Reply posted successfully", "success");
        } catch (error) {
            logger("error", "Post Reply", `Failed to post reply. Error: ${error}`);
            showToast("Failed to post reply", "error");
        }
    };

    commentFooter.append(cancelButton, postButton);
    replyForm.append(commentHeader, content, commentFooter);

    return replyForm;
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
        <span class="delete-subtext">This action cannot be undone.</span>`;

    confirmButton.onclick = async () => {
        try {
            await deleteCommentByOwnerOrCreator(comment.id);

            const commentElement = document.getElementById(`comment-${comment.id}`);

            let nextElement = commentElement?.nextElementSibling;
            while (nextElement && (nextElement.classList.contains("reply-form") || nextElement.classList.contains("replies"))) {
                const toRemove = nextElement;
                nextElement = nextElement.nextElementSibling;
                toRemove.remove();
            }

            commentElement?.remove();

            closeModal(modalContainer);
            showToast("Comment deleted", "success");
        } catch (error) {
            logger("error", "Delete Comment", `Failed to delete the comment with id: [${comment.id}]. Error: [${error}]`);
            showToast("Failed to delete the comment", "error");
        }
    };

    cancelButton.onclick = () => closeModal(modalContainer);
}