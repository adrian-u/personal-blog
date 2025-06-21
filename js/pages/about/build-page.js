import loadAboutData from '../../apis/about.js';
import createOverview from './build-overview.js';
import buildTitle from './build-title.js';
import buildSkills from './build-skills.js';
import buildTimeline from './build-timeline.js';

export default async function buildPage() {
    const data = await loadAboutData();

    const aboutTitle = document.getElementById('about-title');
    const overview = document.getElementById('about-overview');
    const skills = document.getElementById('about-skills');
    const timeline = document.getElementById('about-timeline');

    aboutTitle.innerHTML = buildTitle(data);
    overview.innerHTML = createOverview(data);
    skills.innerHTML = buildSkills(data);
    timeline.innerHTML = buildTimeline(data);
    setupTimelineDrag();
}

function setupTimelineDrag() {
    const timelineEl = document.querySelector('.timeline');
    let isDown = false;
    let startX;
    let scrollLeft;

    timelineEl.addEventListener('mousedown', (e) => {
        isDown = true;
        timelineEl.classList.add('dragging');
        startX = e.pageX - timelineEl.offsetLeft;
        scrollLeft = timelineEl.scrollLeft;
    });
    timelineEl.addEventListener('mouseleave', () => {
        isDown = false;
        timelineEl.classList.remove('dragging');
    });
    timelineEl.addEventListener('mouseup', () => {
        isDown = false;
        timelineEl.classList.remove('dragging');
    });
    timelineEl.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - timelineEl.offsetLeft;
        const walk = (x - startX) * 2;
        timelineEl.scrollLeft = scrollLeft - walk;
    });
}