import { saveUser as saveUserToDb, getUserDetailsByEmail as getUserFromDb, deleteUserFromDb } from "../data-access/user.repository.js";
import { SavingError } from "../errors/custom-errors.js";
import { User } from "../models/user.model.js";
import logger from "../utils/logger.js";
import insertAvatar from "./minio.service.js";

const LOG_CONTEXT = "User Service";

export async function saveUser(userData, provider, traceId) {

    const LOCAL_LOG_CONTEXT = "Save User";

    try {
        logger("info", traceId, `${LOCAL_LOG_CONTEXT}-${LOG_CONTEXT}`, "Start saving user");
        const savedAvatar = await insertAvatar(userData, provider, traceId);
        const user = new User(userData).toWrite();
        const createdUser = await saveUserToDb({
            ...user,
            role: user.email === process.env.CREATOR_EMAIL ? 'creator' : 'user',
            avatarUrl: savedAvatar,
            provider: provider,
        }, traceId);
        return User.fromDBRow(createdUser);
    } catch (error) {
        logger("error", traceId, `${LOCAL_LOG_CONTEXT}-${LOG_CONTEXT}`, `Error saving user data: [${error}]`)
        throw new SavingError("Error saving user data");
    }
}

export async function getUserDetailsById(id, traceId) {
    try {
        const user = await getUserFromDb(id, traceId);
        return User.fromDBRow(user);
    } catch (error) {
        logger("info", traceId, "Fetching user data", `Error get user details by id: [${id}]. Error: [${error}]`);
        throw error;
    }
}

export async function deleteUserById(id, traceId) {
    const LOCAL_LOG_CONTEXT = "Delete User";
    logger("info", traceId, `${LOCAL_LOG_CONTEXT}-${LOG_CONTEXT}`, `Deleting user with id: [${id}]`);

    try {
        await deleteUserFromDb(id, traceId);
    } catch (error) {
        logger("info", traceId, `${LOCAL_LOG_CONTEXT}-${LOG_CONTEXT}`, `Error deleting user with id: [${id}]. Error: [${error}]`);
        throw error;
    }
}