import { select } from "./utils/custom-select.js";

export default function buildArticleMetadata() {

    const articleMetadata = document.getElementById('article-metadata');

    const div = document.createElement("div")
    div.className = "article-metadata";

    div.appendChild(_createIconSelector());
    div.appendChild(_createTitleBox());
    div.appendChild(_createCategorySelector());

    const articleDescription = document.createElement("div");
    articleDescription.className = "article-description";
    const textareaDescription = document.createElement("textarea");
    textareaDescription.name = "article-description";
    textareaDescription.placeholder = "Type here a description of the article";
    articleDescription.appendChild(textareaDescription);

    articleMetadata.appendChild(div);
    articleMetadata.appendChild(articleDescription)

    select();
}

function _createTitleBox() {

    const input = document.createElement("input");
    input.className = "title";
    input.type = "text";
    input.name = "article-title";
    input.placeholder = "Untitled Article - give it a name...";

    return input;
}

function _createCategorySelector() {
    const categories = ["Projects", "Finance"];

    const dropDown = document.createElement("div");
    dropDown.classList.add("custom-dropdown", "categories");
    dropDown.id = "category";

    const hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.name = "article-category";
    hiddenInput.value = categories[0];

    const selected = document.createElement("div");
    selected.className = "selected";
    selected.textContent = categories[0];

    const options = document.createElement("div");
    options.className = "options";

    categories.forEach(category => {
        const option = document.createElement("div");
        option.className = "option";
        option.textContent = category;
        options.appendChild(option);
    });

    dropDown.appendChild(hiddenInput);
    dropDown.appendChild(selected);
    dropDown.appendChild(options);

    return dropDown;
}

function _createIconSelector() {
    const iconOptions = ['📝', '💡', '🚀', '💼', '📊', '🎯', '✨', '🔥', '💻', '🌟'];

    const dropDown = document.createElement("div");
    dropDown.className = "custom-dropdown";
    dropDown.id = "icon";

    const hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.name = "article-icon";
    hiddenInput.value = iconOptions[0];

    const selected = document.createElement("div");
    selected.className = "selected";
    selected.textContent = iconOptions[0];
    selected.name = "article-icon";

    const options = document.createElement("div");
    options.className = "options";

    iconOptions.forEach(icon => {
        const option = document.createElement("div");
        option.className = "option";
        option.textContent = icon;
        options.appendChild(option);
    });

    dropDown.appendChild(hiddenInput);
    dropDown.appendChild(selected);
    dropDown.appendChild(options);

    return dropDown;
}