import { extraSiteInfo } from "../../utils/extra-site-info";
import htmlImporter from "../../utils/html-importer";
import latestArticles from "./home-latest-articles";

export default async function homeInit() {
    await _createInfoModal();
    await latestArticles();
    extraSiteInfo();
}

async function _createInfoModal() {
    await htmlImporter("body", "/components/info-modal.html");
}
