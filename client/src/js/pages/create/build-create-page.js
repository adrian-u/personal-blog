import buildCreateArticleMain from './build-article-main.js';
import buildCreateArticleSideBar from './build-article-sidebar.js';

export default async function buildCreatePage() {
    const sidebar = document.getElementById('sidebar');
    const articleOverview = document.getElementById('article-overview');

    sidebar.innerHTML = buildCreateArticleSideBar();
    articleOverview.innerHTML = buildCreateArticleMain();
}