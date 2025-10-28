import anonymous from "../../../../assets/images/anonymous.png";
import { fetchReplies, editComment, addLikeToComment, removeCommentLike } from "../../../apis/comment";
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
        _buildCommentActions(comment, currentUser, articleId)
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

    commentHeader.append(commentAuthor, _buildDelEditRow(comment, currentUser));

    return commentHeader;
}

function _buildDelEditRow(comment, currentUser) {
    const row = document.createElement("div");
    row.classList.add("comment-del-ed-row");

    row.append(_buildCommentDelete(comment, currentUser), _buildCommentEdit(comment, currentUser));

    return row;
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

function _buildCommentEdit(comment, currentUser) {
    const commentEdit = document.createElement("div");
    commentEdit.classList.add("comment-edit");

    const editButton = document.createElement("button");
    editButton.classList.add("edit-button", currentUser.id === comment.userId ? "show" : "remove-from-layout");
    editButton.disabled = !(currentUser.id === comment.userId);
    editButton.textContent = "✍️";

    editButton.addEventListener("click", (e) => {
        e.stopPropagation();
        const commentElement = document.getElementById(`comment-${comment.id}`);
        const commentContent = commentElement.querySelector(".comment-content");

        const existingEditForm = commentElement.querySelector(".edit-form");
        if (existingEditForm) {
            return;
        }

        const editForm = _buildEditForm(comment, commentContent, currentUser);

        commentContent.style.display = "none";
        commentContent.insertAdjacentElement("afterend", editForm);
    });

    commentEdit.appendChild(editButton);
    return commentEdit;
}

function _buildEditForm(comment, commentContent) {
    const editForm = document.createElement("div");
    editForm.classList.add("edit-form");

    const textarea = document.createElement("textarea");
    textarea.value = comment.content;
    textarea.style.minHeight = "80px";
    textarea.style.width = "100%";

    const editFooter = document.createElement("div");
    editFooter.classList.add("add-comment-footer");

    const cancelButton = document.createElement("button");
    cancelButton.classList.add("btn", "btn-neutral");
    cancelButton.textContent = "Cancel";
    cancelButton.onclick = () => {
        commentContent.style.display = "block";
        editForm.remove();
    };

    const saveButton = document.createElement("button");
    saveButton.classList.add("btn", "btn-green");
    saveButton.textContent = "Save";
    saveButton.disabled = false;

    textarea.addEventListener("input", () => {
        const value = textarea.value.trim();
        saveButton.disabled = !value || value === comment.content;
    });

    saveButton.onclick = async () => {
        const newContent = textarea.value.trim();

        if (!newContent || newContent === comment.content) {
            return;
        }

        try {
            const saved = await editComment(comment.id, newContent);
            comment.content = saved.content;
            commentContent.textContent = saved.content;
            commentContent.style.display = "block";
            editForm.remove();

            showToast("Comment updated successfully", "success");
        } catch (error) {
            logger("error", "Edit Comment", `Failed to edit comment with id: [${comment.id}]. Error: ${error}`);
            showToast("Failed to update comment", "error");
        }
    };

    editFooter.append(cancelButton, saveButton);
    editForm.append(textarea, editFooter);

    return editForm;
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
    likeButton.classList.add(
        "action-btn",
        ...(currentUser.liked_comments.includes(comment.id) ? ["liked"] : [])
    );
    likeButton.textContent = `👍 ${comment.like}`;
    likeButton.onclick = async () => {
        likeButton.disabled = true;

        const isLiked = currentUser.liked_comments.includes(comment.id);

        try {
            if (isLiked) {
                const res = await removeCommentLike(comment.id);

                currentUser.liked_comments = currentUser.liked_comments.filter(
                    (id) => id !== comment.id
                );

                likeButton.classList.remove("liked");
                likeButton.textContent = `👍 ${res.likes}`;
            } else {
                const res = await addLikeToComment(comment.id);

                if (!currentUser.liked_comments.includes(comment.id)) {
                    currentUser.liked_comments.push(comment.id);
                }

                likeButton.classList.add("liked");
                likeButton.textContent = `👍 ${res.likes}`;
            }
        } catch (error) {
            const action = isLiked ? "remove" : "add";
            logger("error", "Comment Like", `Failed to ${action} like to comment with id: [${comment.id}]`);
            showToast(`Failed to ${action} the like`, "error");
        } finally {
            likeButton.disabled = false;
        }

    }


    const showReplies = document.createElement("button");
    showReplies.classList.add("action-btn", "show-replies-btn");
    showReplies.textContent = `💬 Show Replies (${comment.replies})`;
    showReplies.onclick = async () => {
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
            showReplies.textContent = `💬 Show Replies (${comment.replies})`;
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

    const loadMore = document.createElement("button");
    loadMore.classList.add("btn", "btn-green");
    loadMore.id = "load-more-replies";
    loadMore.textContent = "Load More";

    let offset = 0;

    const loadReplies = async () => {
        try {
            const { totalCount, comments: retrievedReplies } = await fetchReplies(id, LIMIT, offset);

            if (!retrievedReplies || retrievedReplies.length === 0) {
                return null;
            }

            retrievedReplies.forEach(reply => {
                replies.appendChild(buildComment(reply, currentUser, articleId, true));
            });

            offset += retrievedReplies.length;

            if (offset + LIMIT > totalCount) {
                loadMore.classList.add("remove-from-layout");
            }

        } catch (error) {
            logger("error", "Fetch replies", `Failed to fetch replies for comment with id: [${id}]. Error: [${error}]`);
            throw error;
        }
    }

    loadMore.onclick = async () => await loadReplies();
    await loadReplies();

    if (replies.children.length === 0) {
        return null;
    }
    replies.appendChild(loadMore);
    return replies;
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