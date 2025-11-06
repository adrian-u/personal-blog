import { fetchLatestArticles } from "../../apis/article";
import logger from "../../utils/logger";
import { showToast } from "../../utils/toast";
import { readArticle } from "../read/read-modal";

export default async function latestArticles() {
    try {
        const articles = await fetchLatestArticles();
        const latestArticlesContainer = document.getElementById("latest-articles");

        const latestTitle = document.createElement("h1");
        latestTitle.textContent = "Latest Articles 📰";
        latestTitle.classList.add("home-section-title", "fade-in");

        const grid = document.createElement("div");
        grid.classList.add("card-grid");
        articles.forEach((item) => {

            const article = document.createElement("article");
            article.classList.add("card");

            article.id = item.id;
            article.addEventListener("click", async () => await readArticle(article.id));

            article.appendChild(_buildCardHeader(item));
            article.appendChild(_description(item));

            grid.appendChild(article);

            requestAnimationFrame(() => {
                setTimeout(() => article.classList.add("visible"), 50);
            });
        });

        latestArticlesContainer.append(latestTitle, grid);
    } catch (error) {
        logger("error", "Load latest articles", `Failed to load latest articles: [${error}]`);
        showToast("Failed to load latest articles", "error");
    }
}

function _buildCardHeader(item) {
    const cardHeader = document.createElement("div");
    cardHeader.classList.add("card-header");

    const cardIcon = document.createElement("div");
    cardIcon.classList.add("card-icon");
    cardIcon.textContent = item.icon;
    cardHeader.appendChild(cardIcon);

    const cardInfo = document.createElement("div");
    cardInfo.classList.add("card-info");
    cardHeader.appendChild(cardInfo);

    const infoTitle = document.createElement("h3");
    infoTitle.textContent = item.title;
    cardInfo.appendChild(infoTitle);

    const date = document.createElement("div");
    date.classList.add("card-date");
    date.textContent = new Date(item.createdAt).toLocaleDateString();
    cardInfo.appendChild(date);

    return cardHeader;
}

function _description(item) {
    const description = document.createElement("p");
    description.classList.add("card-description");
    description.textContent = item.description;

    return description;
}