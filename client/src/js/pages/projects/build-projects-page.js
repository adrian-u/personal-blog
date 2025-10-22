import buildProjectsHeader from './build-projects-header.js';
import buildProjectsOverview from './build-projects-overview.js';

export default async function buildProjectsPage() {

    const header = document.getElementById('projects-header');
    const projects = document.getElementById('projects-overview');

    header.innerHTML = buildProjectsHeader();
    projects.appendChild(await buildProjectsOverview());
}