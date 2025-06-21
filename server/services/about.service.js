import { getAboutFromDb } from "../data-access/about.repository.js";
import { NotFoundError } from "../errors/custom-errors.js";

export async function retrieveAbout() {
    
    const aboutData = await getAboutFromDb();
    
    if(!aboutData) {
        console.error("About data not found");
        throw new NotFoundError("About data not found");
    }

    return aboutData;
}
