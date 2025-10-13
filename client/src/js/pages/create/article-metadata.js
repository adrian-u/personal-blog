export default function buildArticleMetadata() {

    const articleMetadata = document.getElementById('article-metadata');

    const div = document.createElement("div")
    div.className = "article-metadata";

    const divMetadataBoxRow = document.createElement("div")
    divMetadataBoxRow.className = "article-metadata-row";

    divMetadataBoxRow.appendChild(_createTitleBox());
    divMetadataBoxRow.appendChild(_createIconSelector());
    divMetadataBoxRow.appendChild(_createCategorySelector());

    const articleDescription = document.createElement("div");
    articleDescription.className = "article-description";
    const textareaDescription = document.createElement("textarea");
    textareaDescription.name = "article-description";
    textareaDescription.placeholder = "Type here a description of the article";
    articleDescription.appendChild(textareaDescription);

    div.appendChild(divMetadataBoxRow);

    articleMetadata.appendChild(div);
    articleMetadata.appendChild(articleDescription)
}

function _createTitleBox() {

    const div = document.createElement("div");
    div.className = "metadata-box";

    const p = document.createElement("p");
    p.textContent = "Title";

    const input = document.createElement("input");
    input.type = "text";
    input.name = "article-title";

    div.appendChild(p);
    div.appendChild(input);

    return div;
}

function _createIconSelector() {

    const iconOptions = ['📝', '💡', '🚀', '💼', '📊', '🎯', '✨', '🔥', '💻', '🌟'];

    const div = document.createElement("div");
    div.className = "metadata-box";

    const select = document.createElement("select");
    select.className = "icon";
    select.name = "article-icon";

    const p = document.createElement("p");
    p.textContent = "Icon";


    iconOptions.forEach(icon => {
        const option = document.createElement("option");
        option.textContent = icon;

        select.appendChild(option);
    });

    div.appendChild(p);
    div.appendChild(select);

    return div;
}

function _createCategorySelector() {
    const categories = ["Projects", "Finance"];

    const div = document.createElement("div");
    div.className = "metadata-box";

    const select = document.createElement("select");
    select.className = "category";
    select.name = "article-category";

    const p = document.createElement("p");
    p.textContent = "Category";

    categories.forEach(category => {
        const option = document.createElement("option");
        option.textContent = category;

        select.appendChild(option);
    });

    div.appendChild(p);
    div.appendChild(select);

    return div;
}