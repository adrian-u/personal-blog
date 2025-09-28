export default function buildPreferredArticlesSection() {

    const data = _mockedData();

    return `
        <h2>Liked</h2>
        <div class="liked-container">
            ${data.map(item => `
                <div class="liked-card">
                <div class="liked-article-header">
                    <img src=${item.icon} alt="article icon" class="article-icon like-icon"/>
                    <div>
                        <h2 class="liked-title">${item.title}</h2>
                        <p class="liked-date">${item.date}</p>
                    </div>
                </div>
                <p class="liked-content">
                    ${item.shortDesc}
                </p>
            </div>
            `).join("")}
        </div>`;
}

function _mockedData() {
    return [{
        "title": "A new start",
        "icon": "/assets/images/contact.png",
        "shortDesc": "A blog for a new start. Here I want to show the world what can I build and also I want to talk about my investing journey",
        "id": 1,
        "date": "28/09/2025"
    }, {
        "title": "A new start",
        "icon": "/assets/images/contact.png",
        "shortDesc": "A blog for a new start. Here I want to show the world what can I build and also I want to talk about my investing journey",
        "id": 1,
        "date": "28/09/2025"
    }, {
        "title": "A new start",
        "icon": "/assets/images/contact.png",
        "shortDesc": "A blog for a new start. Here I want to show the world what can I build and also I want to talk about my investing journey",
        "id": 1,
        "date": "28/09/2025"
    }, {
        "title": "A new start",
        "icon": "/assets/images/contact.png",
        "shortDesc": "A blog for a new start. Here I want to show the world what can I build and also I want to talk about my investing journey",
        "id": 1,
        "date": "28/09/2025"
    }, {
        "title": "A new start",
        "icon": "/assets/images/contact.png",
        "shortDesc": "A blog for a new start. Here I want to show the world what can I build and also I want to talk about my investing journey",
        "id": 1,
        "date": "28/09/2025"
    }];
}