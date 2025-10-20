import { getArticlesWithoutMarkdown } from "../../apis/article";
import { closeModal, openConfirmationModal } from "../../utils/modals";
import { loadWipArticle } from "./build-create-page";

export default async function buildArticleWip() {
    const wipArticle = document.getElementById("wip-article");
    wipArticle.className = "articles-wip-section";

    while (wipArticle.firstChild) {
        wipArticle.removeChild(wipArticle.firstChild);
    }

    (await getArticlesWithoutMarkdown()).forEach(article => {
        const box = renderArticle(article);
        wipArticle.appendChild(box);
    });
}

export function renderArticle(article) {
    const workInProgressBox = document.createElement("div");
    workInProgressBox.className = "article-wip-box";
    workInProgressBox.id = article.id;
    workInProgressBox.addEventListener('click', () => {
        loadWipArticle(workInProgressBox.id);
    });
    workInProgressBox.appendChild(_createIconSection(article.icon));
    workInProgressBox.appendChild(_createInfoSection(article));
    return workInProgressBox;
}

function _createIconSection(icon) {
    const iconDiv = document.createElement("div");
    iconDiv.className = "article-wip-icon";
    iconDiv.textContent = icon;
    return iconDiv;
}

function _createInfoSection(article) {
    const infoSection = document.createElement("div");

    const boxHeader = document.createElement("div");
    boxHeader.className = "wip-header-box";

    const title = document.createElement("h1");
    title.className = "wip-title";
    title.textContent = article.title;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "✕";
    deleteButton.addEventListener("click", (e) => {
        e.stopPropagation();
        _buildDeleteConfirmationModal(article.title);
        openConfirmationModal();
    });

    boxHeader.appendChild(title);
    boxHeader.appendChild(deleteButton);

    const greenLine = document.createElement("div");
    greenLine.className = "green-line";

    const description = document.createElement("p");
    description.className = "description-paragraph";
    description.textContent = article.description;

    const meta = document.createElement("div");
    meta.className = "wip-article-meta";

    const category = document.createElement("span");
    category.className = "article-type";
    category.textContent = article.category;

    const date = document.createElement("span");
    date.className = "article-date";
    date.textContent = new Date(article.created_at).toISOString().split("T")[0];

    meta.appendChild(category);
    meta.appendChild(date);

    infoSection.appendChild(boxHeader);
    infoSection.appendChild(greenLine);
    infoSection.appendChild(description);
    infoSection.appendChild(meta);

    return infoSection;
}

function _buildDeleteConfirmationModal(title) {
    const modalContainer = document.getElementById("confirmation-modal");
    const contentModal = modalContainer.querySelector("#confirmation-content");
    contentModal.classList.add("delete-confirmation");

    const modalHeader = contentModal.querySelector("#conf-header");
    const modalText = contentModal.querySelector("#conf-text");
    const confirmButton = contentModal.querySelector("#confirm");
    const cancelButton = contentModal.querySelector("#cancel");

    modalHeader.textContent = "Confirm Deletion";
    modalText.innerHTML = `
    <span>Are you sure you want to delete <strong class="delete-title">${title}</strong>?</span>
    <br>
    <span class="delete-subtext">This action cannot be undone.</span>`

    confirmButton.onclick = () => {
        alert("Article Deleted!");
        closeModal(modalContainer);
    };

    cancelButton.onclick = () => closeModal(modalContainer);
}