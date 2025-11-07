import { fetchLatestArticles } from "../../apis/article";
import logger from "../../utils/logger";
import { showToast } from "../../utils/toast";
import buildCards from "../common/card-grid";

export default async function latestArticles() {
    try {
        const articles = await fetchLatestArticles();
        const latestArticlesContainer = document.getElementById("latest-articles");

        const latestTitle = document.createElement("h1");
        latestTitle.textContent = "Latest Articles 📰";
        latestTitle.classList.add("home-section-title", "fade-in");

        const grid = document.createElement("div");
        grid.classList.add("card-grid");
        buildCards(grid, articles)

        latestArticlesContainer.append(latestTitle, grid);
    } catch (error) {
        logger("error", "Load latest articles", `Failed to load latest articles: [${error}]`);
        showToast("Failed to load latest articles", "error");
    }
}