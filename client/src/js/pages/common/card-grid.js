import { readArticle } from "../read/read-modal";

export default function buildCards(grid, articles) {
    articles.forEach((item) => {

        const article = document.createElement("article");
        article.classList.add("card");

        article.id = item.id;
        article.addEventListener("click", async () => await readArticle(article.id));

        article.append(_buildCardHeader(item), _description(item));

        grid.appendChild(article);

        requestAnimationFrame(() => {
            setTimeout(() => article.classList.add("visible"), 50);
        });
    });

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