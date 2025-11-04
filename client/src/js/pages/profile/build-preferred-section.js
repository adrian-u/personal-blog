import heart from "../../../assets/images/heart.png";

export default function buildPreferredArticlesSection(user) {
    const preferredArticles = document.getElementById('preferred-articles');

    const titleFlex = document.createElement("div");
    titleFlex.classList.add("liked-title");

    const title = document.createElement("h1");
    title.textContent = "Liked Articles ";

    const heartImg = document.createElement("img");
    heartImg.src = heart;
    heartImg.alt = "heart icon";
    heartImg.classList.add("png");

    titleFlex.append(title, heartImg)

    preferredArticles.append(titleFlex, _buildLikedArticlesSection(user));
}

function _buildLikedArticlesSection(item) {
    const likedGrid = document.createElement("div");
    likedGrid.classList.add("liked-grid");

    _mockedData().forEach(item => {
        likedGrid.appendChild(_createArticle(item));
    });

    return likedGrid;
}

function _createArticle(item) {
    const article = document.createElement("article");
    article.classList.add("card", "visible");
    article.id = item.id;

    article.append(_buildCardHeader(item), _description(item));

    return article;
}

function _buildCardHeader(item) {
    const cardHeader = document.createElement("div");
    cardHeader.classList.add("card-header");

    const cardIcon = document.createElement("div");
    cardIcon.classList.add("card-icon");
    cardIcon.textContent = "♥";
    cardHeader.appendChild(cardIcon);

    const cardInfo = document.createElement("div");
    cardInfo.classList.add("card-info");
    cardHeader.appendChild(cardInfo);

    const infoTitle = document.createElement("h3");
    infoTitle.textContent = item.title;
    cardInfo.appendChild(infoTitle);

    const date = document.createElement("div");
    date.classList.add("card-date");
    date.textContent = new Date(item.date).toLocaleDateString();
    cardInfo.appendChild(date);

    return cardHeader;
}

function _description(item) {
    const description = document.createElement("p");
    description.classList.add("card-description");
    description.textContent = item.shortDesc;

    return description;
}

function _mockedData() {
    return [{
        "title": "A new start",
        "icon": "/assets/images/contact.png",
        "shortDesc": "A blog for a new start. Here I want to show the world what can I build and also I want to talk about my investing journey",
        "id": 1,
        "date": "28/09/2025"
    }, {
        "title": "Second Article",
        "icon": "/assets/images/contact.png",
        "shortDesc": "Another exciting article about development and growth",
        "id": 2,
        "date": "29/09/2025"
    }, {
        "title": "Third Article",
        "icon": "/assets/images/contact.png",
        "shortDesc": "More content about my journey and experiences",
        "id": 3,
        "date": "30/09/2025"
    }, {
        "title": "Fourth Article",
        "icon": "/assets/images/contact.png",
        "shortDesc": "Continuing the series with more insights",
        "id": 4,
        "date": "01/10/2025"
    }, {
        "title": "Fifth Article",
        "icon": "/assets/images/contact.png",
        "shortDesc": "The latest update on my investing and building journey",
        "id": 5,
        "date": "02/10/2025"
    }];
}