export default function buildProfessionalExperiences(experiences) {

    const section = document.getElementById("prof-exp");

    const title = document.createElement("h3");
    title.classList.add("section-title");
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
    experienceIcon.setAttribute("aria-hidden", "true");

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
    content.setAttribute("role", "region");

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
    const subExperiencesContainer = document.createElement("div");

    if (!experience.subExperiences || experience.subExperiences.length === 0) {
        return subExperiencesContainer;
    }

    subExperiencesContainer.classList.add("sub-experiences");

    experience.subExperiences.forEach(subExp => {

        const subExpItem = document.createElement("div");
        subExpItem.classList.add("sub-experience-item");

        const subExpHead = document.createElement("div");
        subExpHead.classList.add("sub-experience-header");

        const subExpIcon = document.createElement("img");
        subExpIcon.classList.add("sub-experience-icon");
        subExpIcon.src = subExp.icon;
        subExpIcon.alt = subExp.title;
        subExpIcon.setAttribute("aria-hidden", "true");

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

        const techFragment = document.createDocumentFragment();

        if (subExp.technologies && subExp.technologies.length > 0) {
            subExp.technologies.forEach(tech => {
                const span = document.createElement("span");
                span.className = "tech-tag";
                span.textContent = tech.name;

                if (tech.icon && typeof tech.icon === "string") {
                    const img = document.createElement("img");
                    img.className = "tech-icon-exp";
                    img.src = tech.icon;
                    img.alt = tech.name;
                    span.appendChild(document.createTextNode(" "));
                    span.appendChild(img);
                }

                techFragment.appendChild(span);
            });
        }

        techTags.appendChild(techFragment);

        subExpItem.append(subExpHead, subExpDesc, techTags);
        subExperiencesContainer.appendChild(subExpItem);
    });

    return subExperiencesContainer;
}