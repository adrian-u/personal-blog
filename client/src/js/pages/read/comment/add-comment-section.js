import anonymous from "../../../../assets/images/anonymous.png";
import { publishComment } from "./comment-common";
import { showToast } from "../../../utils/toast";
import logger from "../../../utils/logger";
import { buildComment } from "./comments-section";

export function addCommentSection(articleId, currentUser) {

    const addComment = document.createElement("div");
    addComment.classList.add("add-comment");

    const textComment = document.createElement("textarea");
    textComment.placeholder = "Write what you think";

    addComment.append(_addCommentHeader(currentUser), textComment, _addCommentFooter(articleId, currentUser, textComment));

    return addComment;
}

function _addCommentHeader(currentUser) {
    const addCommentHeader = document.createElement("div");
    addCommentHeader.classList.add("add-comment-header");

    const avatar = document.createElement("img");
    avatar.classList.add("comment-avatar");
    avatar.src = anonymous;

    const addCommentLabel = document.createElement("div");
    addCommentLabel.classList.add("add-comment-label");
    addCommentLabel.textContent = "Share your thoughts";

    addCommentHeader.append(avatar, addCommentLabel);

    return addCommentHeader;
}

function _addCommentFooter(articleId, currentUser, textComment) {

    const footer = document.createElement("div");
    footer.classList.add("add-comment-footer");

    const publishButton = document.createElement("button");
    publishButton.textContent = "Post Comment";
    publishButton.classList.add("btn", "btn-green", "remove-from-layout");
    publishButton.disabled = true;

    textComment.addEventListener("input", () => {
        const value = textComment.value.trim();
        publishButton.disabled = !value;
        if (value) {
            publishButton.classList.remove("remove-from-layout");
        } else {
            publishButton.classList.add("remove-from-layout");
        }
    });

    publishButton.onclick = async () => {
        try {
            const newComment = await publishComment({ content: textComment.value, isReply: false }, articleId);
            textComment.value = "";

            const comments = document.querySelector(".comments-section");

            if (comments) {
                const newCommentBox = buildComment(newComment, currentUser, articleId);
                newCommentBox.classList.add("new");
                const divider = document.createElement("div");
                divider.classList.add("divider");
                comments.prepend(divider);
                comments.prepend(newCommentBox);
            }
        } catch (error) {
            logger("error", "Publish Comment", `Failed to save the comment. Error: ${error}`);
            showToast("Failed to save the comment", "error");
        }
    }

    footer.appendChild(publishButton);
    return footer;
}