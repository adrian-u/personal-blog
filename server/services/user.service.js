import { saveUser as saveUserToDb } from "../data-access/user.repository.js";
import { SavingError } from "../errors/custom-errors.js";

export async function saveUser(user) {

    try {
        await saveUserToDb(user);
    } catch (error) {
        console.error(`Error saving user data: [${error}]`)
        throw new SavingError("Error saving user data");
    }
}