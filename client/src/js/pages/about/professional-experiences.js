export default function buildProfessionalExperiences(experiences) {

    const section = document.getElementById("prof-exp");

    const title = document.createElement("h3");
    title.textContent = "Professional Experiences";

    const experienceList = document.createElement("div");
    experienceList.id = "experience-list";

    experiences.forEach(item => _buildExperiences(experienceList, item));

    section.append(title, experienceList);
}

function _buildExperiences(experienceList, experience) {
    const item = document.createElement("div");
    item.classList.add("experience-item");

    const experienceHeader = document.createElement("div");
    experienceHeader.classList.add("experience-header");

    const experienceLeft = document.createElement("div");
    experienceLeft.classList.add("experience-left");

    const experienceIcon = document.createElement("img");
    experienceIcon.classList.add("experience-icon");
    experienceIcon.src = experience.icon;

    const experienceInfo = document.createElement("div");
    experienceInfo.classList.add("experience-info");

    const experienceTitle = document.createElement("div");
    experienceTitle.classList.add("experience-title");
    experienceTitle.textContent = experience.title;

    const experiencePeriod = document.createElement("div");
    experiencePeriod.classList.add("experience-period");
    experiencePeriod.textContent = experience.period;

    const experienceRight = document.createElement("div");
    experienceRight.classList.add("experience-right");

    const span = document.createElement("span");
    span.classList.add("expand-icon");
    span.textContent = "▼";

    experienceInfo.append(experienceTitle, experiencePeriod);
    experienceLeft.append(experienceIcon, experienceInfo);
    experienceRight.append(span);
    experienceHeader.append(experienceLeft, experienceRight);

    const content = document.createElement("div");
    content.classList.add("experience-content");

    const experienceDescription = document.createElement("div");
    experienceDescription.classList.add("experience-description");
    experienceDescription.textContent = experience.description;

    const subExperiences = _buildSubExperencies(experience);

    content.append(experienceDescription, subExperiences);

    item.append(experienceHeader, content);

    item.querySelector('.experience-header').addEventListener('click', () => {
        item.classList.toggle('expanded');
    });

    experienceList.appendChild(item);
}

function _buildSubExperencies(experience) {

    const subExperiences = document.createElement("div");

    if (experience.subExperiences && experience.subExperiences.length > 0) {
        subExperiences.classList.add("sub-experiences");
        experience.subExperiences.forEach(subExp => {
            const technologies = subExp.technologies.map(tech => {
                if (typeof tech === 'object' && tech.icon) {
                    return `<span class="tech-tag">${tech.name} <img src="${tech.icon}" alt="${tech.name}" class="tech-icon"></span>`;
                }
                return `<span class="tech-tag">${tech.name}</span>`;
            }).join('');

            const subExpItem = document.createElement("div");
            subExpItem.classList.add("sub-experience-item");

            const subExpHead = document.createElement("div");
            subExpHead.classList.add("sub-experience-header");
            const subExpIcon = document.createElement("img");
            subExpIcon.classList.add("sub-experience-icon");
            subExpIcon.src = subExp.icon;

            const subExpInfo = document.createElement("div");
            subExpInfo.classList.add("sub-experience-info");

            const subExpTitle = document.createElement("div");
            subExpTitle.classList.add("sub-experience-title");
            subExpTitle.textContent = subExp.title;

            const subExpPeriod = document.createElement("div");
            subExpPeriod.classList.add("sub-experience-period");
            subExpPeriod.textContent = subExp.period;

            subExpInfo.append(subExpTitle, subExpPeriod);
            subExpHead.append(subExpIcon, subExpInfo);

            const subExpDesc = document.createElement("div");
            subExpDesc.classList.add("sub-experience-description");
            subExpDesc.textContent = subExp.description;

            const techTags = document.createElement("div");
            techTags.classList.add("tech-tags");
            techTags.innerHTML = technologies;

            subExpItem.append(subExpHead, subExpDesc, techTags);

            subExperiences.appendChild(subExpItem);
        });
    }

    return subExperiences;
}