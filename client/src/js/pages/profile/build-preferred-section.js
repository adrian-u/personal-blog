import heart from "../../../assets/images/heart.png";
import { fetchFavoriteArticles } from "../../apis/article";
import logger from "../../utils/logger";
import { showToast } from "../../utils/toast";
import { readArticle } from "../read/read-modal";

const LIMIT = 6;
let offset = 0;
let totalCount = 0;

export default async function buildPreferredArticlesSection() {
    const preferredArticles = document.getElementById('preferred-articles');
    offset = 0;
    preferredArticles.innerHTML = "";

    const titleFlex = document.createElement("div");
    titleFlex.classList.add("liked-title");

    const title = document.createElement("h1");
    title.textContent = "Liked Articles ";

    const heartImg = document.createElement("img");
    heartImg.src = heart;
    heartImg.classList.add("png");

    titleFlex.append(title, heartImg);

    const likedGrid = document.createElement("div");
    likedGrid.classList.add("liked-grid");

    const loadMoreButton = document.createElement("button");
    loadMoreButton.classList.add("btn", "btn-green");
    loadMoreButton.textContent = "Load More";

    preferredArticles.append(titleFlex, likedGrid, loadMoreButton);

    await loadMoreArticles(likedGrid, loadMoreButton);

    loadMoreButton.addEventListener("click", async () => {
        await loadMoreArticles(likedGrid, loadMoreButton);
    });
}

async function loadMoreArticles(likedGrid, loadMoreButton) {
    try {
        loadMoreButton.disabled = true;
        loadMoreButton.classList.add("loading");
        const { totalCount: total, articles } = await fetchFavoriteArticles(LIMIT, offset);
        totalCount = total;

        articles.forEach(item => likedGrid.appendChild(_createArticle(item)));

        offset += LIMIT;
        loadMoreButton.disabled = false;
        loadMoreButton.classList.remove("loading");
        loadMoreButton.textContent = "Load More";

        if (offset >= totalCount) {
            loadMoreButton.style = "display: none";
        }

    } catch (error) {
        logger("error", "Loading Favorite Articles", `Failed to load favorite articles. Error: [${error}]`);
        showToast("Error fetching favorite articles", "error");
        loadMoreButton.style.display = "none";
    }
}

function _createArticle(item) {
    const article = document.createElement("article");
    article.classList.add("card", "visible");
    article.id = item.id;
    article.addEventListener("click", async () => await readArticle(article.id));

    article.append(_buildCardHeader(item), _description(item));

    return article;
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