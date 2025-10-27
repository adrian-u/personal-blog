import { saveUser as saveUserToDb, getUserDetailsByEmail as getUserFromDb } from "../data-access/user.repository.js";
import { SavingError } from "../errors/custom-errors.js";

export async function saveUser(user) {

    try {
        return await saveUserToDb(user);
    } catch (error) {
        console.error(`Error saving user data: [${error}]`)
        throw new SavingError("Error saving user data");
    }
}

export async function getUserDetailsByEmail(email) {
    try {
        return await getUserFromDb(email);
    } catch (error) {
        console.error(`Error get user details by email: [${error}]`);
        throw error;
    }
}