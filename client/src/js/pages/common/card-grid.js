import { navigateTo } from "../../router/router";

export default function buildCards(grid, articles) {

    articles.forEach((item) => {
        const article = document.createElement("article");
        article.classList.add("card");
        article.id = item.id;

        const headingId = `article-heading-${item.id}`;
        article.setAttribute("aria-labelledby", headingId);

        article.append(_buildCardHeader(item, headingId), _description(item));

        grid.appendChild(article);

        requestAnimationFrame(() => {
            setTimeout(() => article.classList.add("visible"), 50);
        });
    });
}

function _buildCardHeader(item, headingId) {
    const cardHeader = document.createElement("div");
    cardHeader.classList.add("card-header");

    const cardIcon = document.createElement("div");
    cardIcon.classList.add("card-icon");
    cardIcon.textContent = item.icon;

    cardIcon.setAttribute("aria-hidden", "true");
    cardHeader.appendChild(cardIcon);

    const cardInfo = document.createElement("div");
    cardInfo.classList.add("card-info");
    cardHeader.appendChild(cardInfo);

    const infoTitle = document.createElement("h3");
    infoTitle.id = headingId;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = item.title;
    btn.classList.add("card-stretched-link");

    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        navigateTo(`/article/${item.id}`);
    });

    infoTitle.appendChild(btn);
    cardInfo.appendChild(infoTitle);

    const date = document.createElement("time");
    date.classList.add("card-date");
    date.setAttribute("datetime", new Date(item.createdAt).toISOString());
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