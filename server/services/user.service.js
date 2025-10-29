import { saveUser as saveUserToDb, getUserDetailsByEmail as getUserFromDb } from "../data-access/user.repository.js";
import { SavingError } from "../errors/custom-errors.js";
import { User } from "../models/user.model.js";
import logger from "../utils/logger.js";

const LOG_CONTEXT = "User Service";

export async function saveUser(userData, provider, traceId) {

    const LOCAL_LOG_CONTEXT = "Save User";

    try {
        logger("info", traceId, `${LOCAL_LOG_CONTEXT}-${LOG_CONTEXT}`, "Start saving user");
        const user = new User(userData).toWrite();
        const createdUser = await saveUserToDb({
            ...user,
            role: user.email === process.env.CREATOR_EMAIL ? 'creator' : 'user',
            avatarUrl: userData.picture,
            provider: provider,
        }, traceId);
        return User.fromDBRow(createdUser);
    } catch (error) {
        logger("error", traceId, `${LOCAL_LOG_CONTEXT}-${LOG_CONTEXT}`, `Error saving user data: [${error}]`)
        throw new SavingError("Error saving user data");
    }
}

export async function getUserDetailsByEmail(email, traceId) {
    try {
        const user = await getUserFromDb(email, traceId);
        return User.fromDBRow(user);
    } catch (error) {
        logger("info", traceId, "Fetching user data", `Error get user details by email: [${error}]`);
        throw error;
    }
}