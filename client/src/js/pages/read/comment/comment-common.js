import { getUserFromJWT } from "../../../auth/auth";
import { isEmpty } from "../../../utils/general";
import logger from "../../../utils/logger";
import { showToast } from "../../../utils/toast";
import { createComment, fetchParentComments, deleteComment, fetchReplies } from "../../../apis/comment";

const LOG_CONTEXT = "Common Comment Service";

export async function publishComment(comment, articleId) {

    const LOCAL_LOG_CONTEXT = "Publish";

    console.log(comment);

    if (comment.isReply) {
        if (!_isReplyValid(comment.content, comment.parentId)) {
            showToast(`The reply is not valid`, "error");
            return;
        }
    } else {
        if (!_isCommentValid(comment.content)) {
            showToast(`The comment is empty`, "error");
            return;
        }
    }

    const user = getUserFromJWT();

    try {
        return await createComment(comment, user.id, articleId);
    } catch (error) {
        logger("error", `${LOG_CONTEXT}-${LOCAL_LOG_CONTEXT}`, error);
        throw error;
    }

}

export async function getParentComments(articleId, limit, offset) {

    const LOCAL_LOG_CONTEXT = "Get Parent Comments";

    try {
        return await fetchParentComments(articleId, limit, offset);
    } catch (error) {
        logger("error", `${LOG_CONTEXT}-${LOCAL_LOG_CONTEXT}`, error);
        showToast(`Failed to load parent comments for articleId: [${articleId}]`, "error");
    }
}

export async function deleteCommentByOwnerOrCreator(commentId) {

    const LOCAL_LOG_CONTEXT = "Delete by owner or creator";

    try {
        await deleteComment(commentId);
    } catch (error) {
        logger("error", `${LOG_CONTEXT}-${LOCAL_LOG_CONTEXT}`, error);
        throw error;
    }
}

export async function getParentReplies(parentId, limit, offset) {

    const LOCAL_LOG_CONTEXT = "Get Parent Replies";

    try {
        return await fetchReplies(parentId, limit, offset);
    } catch (error) {
        logger("error", `${LOG_CONTEXT}-${LOCAL_LOG_CONTEXT}`, error);
        showToast(`Failed to load replies for parent comment: [${parentId}]`, "error");
    }
}


function _isCommentValid(content) {

    if (isEmpty(content)) {
        logger("error", "Comment", `Empty comment`);
        return false;
    }

    return true;
}

function _isReplyValid(content, parentId) {

    if (isEmpty(content)) {
        logger("error", "Comment", `Empty comment`);
        return false;
    }

    console.log(parentId);

    if (!parentId || parentId === 0) {
        logger("error", "Comment", `Invalid parent`);
        return false;
    }

    return true;
}