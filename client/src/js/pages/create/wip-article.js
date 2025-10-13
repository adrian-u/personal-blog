import { getArticlesWithoutMarkdown } from "../../apis/article";

export default async function buildArticleWip() {
    const wipArticle = document.getElementById("wip-article");
    (await getArticlesWithoutMarkdown()).forEach(article => {
        const workInProgressBox = document.createElement("div");
        workInProgressBox.className = "article-wip-box";
        workInProgressBox.id = article.id;
        workInProgressBox.appendChild(_createHeaderSection(article));
        workInProgressBox.appendChild(_createCategoryDateSection(article));
        workInProgressBox.appendChild(_createDescriptionSection(article));
        wipArticle.appendChild(workInProgressBox);
    })
}

function _createHeaderSection(article) {
    const headerDiv = document.createElement("div");
    headerDiv.className = "wip-box-header";

    const icon = document.createElement("p");
    icon.textContent = article.icon;
    headerDiv.appendChild(icon);

    const title = document.createElement("h1");
    title.textContent = article.title;
    headerDiv.appendChild(title);

    return headerDiv;
}

function _createCategoryDateSection(article) {
    const categoryDiv = document.createElement("div");
    categoryDiv.className = "wip-box-category-date";

    const category = document.createElement("h1");
    category.textContent = article.category;
    categoryDiv.appendChild(category);

    const date = document.createElement("p");
    date.className = "wip-date";
    date.textContent = new Date(article.created_at).toISOString().split("T")[0];
    categoryDiv.appendChild(date);

    const published = document.createElement("p");
    published.className = "published";
    published.textContent = article.published ? "" : "Not Published";
    categoryDiv.appendChild(published);

    return categoryDiv;
}

function _createDescriptionSection(article) {
    const description = document.createElement("p");
    description.className = "description-paragraph";
    description.textContent = article.description;

    return description;
}
