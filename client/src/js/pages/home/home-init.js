import { extraSiteInfo } from "../../utils/extra-site-info";
import htmlImporter from "../../utils/html-importer";
import latestArticles from "./home-latest-articles";

export default async function homeInit() {

    const infoModal = document.getElementById("info-modal");
    if (!infoModal) await _createInfoModal();

    await latestArticles();
    extraSiteInfo();
}

async function _createInfoModal() {
    await htmlImporter("body", "/components/info-modal.html");
}
