import { getUserFromJWT } from "../../auth/auth";
import { isEmpty } from "../../utils/general";
import logger from "../../utils/logger";
import { showToast } from "../../utils/toast";
import { createComment, fetchParentComments, deleteComment } from "../../apis/comment";

const LOG_CONTEXT = "Common Comment Service";

export async function publishComment(content, articleId) {

    const LOCAL_LOG_CONTEXT = "Publish";

    if (!_isCommentValid(content)) {
        showToast(`The comment is empty`, "error");
        return;
    }

    const user = getUserFromJWT();

    try {
        return await createComment(content, user.id, articleId);
    } catch (error) {
        logger("error", `${LOG_CONTEXT}-${LOCAL_LOG_CONTEXT}`, error);
        showToast("Failed to save the comment", "error");
        return null;
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

function _isCommentValid(content) {

    if (isEmpty(content)) {
        logger("error", "Comment", `Empty comment`);
        return false;
    }

    return true;
}