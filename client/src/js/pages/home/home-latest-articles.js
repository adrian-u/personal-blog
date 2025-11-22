import { fetchLatestArticles } from "../../apis/article";
import logger from "../../utils/logger";
import { showToast } from "../../utils/toast";
import buildCards from "../common/card-grid";

export default async function latestArticles() {
    try {
        const articles = await fetchLatestArticles();
        const latestArticlesContainer = document.getElementById("latest-articles");

        const grid = document.createElement("div");
        grid.classList.add("card-grid");
        buildCards(grid, articles)

        latestArticlesContainer.append(grid);
    } catch (error) {
        logger("error", "Load latest articles", `Failed to load latest articles: [${error}]`);
        showToast("Failed to load latest articles", "error");
    }
}