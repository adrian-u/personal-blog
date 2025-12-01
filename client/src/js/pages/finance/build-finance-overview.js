import { getArticlesByCategory } from "../../apis/article";
import logger from "../../utils/logger";
import { showToast } from "../../utils/toast";
import buildCards from "../common/card-grid";


const LIMIT = 6;
let offset = 0;
const LOG_CONTEXT = "Finance Articles Overview"

export default async function buildFinanceOverview() {

    offset = 0;

    const grid = document.createElement("div");
    grid.classList.add("card-grid");

    const loadMoreButton = document.getElementById("load-more");
    loadMoreButton.addEventListener("click", () => _loadArticles(grid, loadMoreButton));

    _loadArticles(grid, loadMoreButton);

    return grid;
}

async function _loadArticles(grid, loadMoreButton) {

    try {
        loadMoreButton.disabled = true;
        loadMoreButton.classList.add("loading");
        const { totalCount, articles } = await getArticlesByCategory("finance", LIMIT, offset);

        buildCards(grid, articles);

        offset += LIMIT;
        loadMoreButton.disabled = false;
        loadMoreButton.classList.remove("loading");
        loadMoreButton.textContent = "Load More";

        if (offset >= totalCount) {
            loadMoreButton.style = "display: none";
        }

    } catch (error) {
        logger("error", `${LOG_CONTEXT} - "Loading Articles"`, error);
        showToast("Failed to load articles", "error");
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