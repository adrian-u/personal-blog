import createOverview from './build-overview.js';
import buildTitle from './build-title.js';
import buildSkills from './build-skills.js';
import buildProfessionalExperiences from './professional-experiences.js';
import { aboutData } from './about-data.js';

export default async function buildPage() {
    buildTitle();
    createOverview(aboutData.descriptions);
    buildProfessionalExperiences(aboutData.experience);
    buildSkills(aboutData.techStack);
}