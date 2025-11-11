import { extraSiteInfo } from "../../utils/extra-site-info";
import htmlImporter from "../../utils/html-importer";
import latestArticles from "./home-latest-articles";

export default async function homeInit() {
    await latestArticles();
    await _createInfoModal();
    extraSiteInfo();
}

async function _createInfoModal() {
    await htmlImporter("body", "./src/components/info-modal.html");
}
