import { getArticlesByCategory } from "../../apis/article";
import logger from "../../utils/logger";
import { showToast } from "../../utils/toast";
import buildCards from "../common/card-grid";


const LIMIT = 6;
let offset = 0;
const LOG_CONTEXT = "Projects Articles Overview"

export default async function buildProjectsOverview() {

    offset = 0;

    const grid = document.createElement("div");
    grid.classList.add("card-grid");
    grid.setAttribute("role", "list");

    const loadMoreButton = document.getElementById("load-more");
    loadMoreButton.style.display = "block";

    const newButton = loadMoreButton.cloneNode(true);
    loadMoreButton.parentNode.replaceChild(newButton, loadMoreButton);

    newButton.addEventListener("click", () => _loadArticles(grid, newButton));

    await _loadArticles(grid, newButton, true);

    return grid;
}

async function _loadArticles(grid, loadMoreButton) {

    try {
        loadMoreButton.disabled = true;
        loadMoreButton.classList.add("loading");
        const { totalCount, articles } = await getArticlesByCategory("projects", LIMIT, offset);

        buildCards(grid, articles);

        offset += LIMIT;
        loadMoreButton.disabled = false;
        loadMoreButton.classList.remove("loading");
        loadMoreButton.textContent = "Load More";
        loadMoreButton.setAttribute("aria-busy", "true");

        if (offset >= totalCount) {
            loadMoreButton.style = "display: none";
        }

    } catch (error) {
        logger("error", `${LOG_CONTEXT} - "Loading Articles"`, error);
        showToast("Failed to load articles", "error");
    }
}