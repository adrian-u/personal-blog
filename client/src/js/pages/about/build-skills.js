export default function buildSkills(techStack) {
	const tech = document.getElementById("about-skills");
	tech.classList.add("tech-section");

	const techTitle = document.createElement("h3");
	techTitle.classList.add("section-title");
	techTitle.textContent = "Teck Stack";

	const description = document.createElement("p");
	description.textContent = "These are the tools I use most frequently, both for work and personal projects." +
		"They’re not the only ones I’ve used — depending on the project " +
		"I’ve also worked with additional technologies such as Camunda or AngularJS or other in the past, " +
		" but the ones listed here are the ones I rely on most regularly rather than one-off tools."
	const techGrid = document.createElement("div");
	techGrid.classList.add("tech-grid");

	techStack.forEach(tech => _buildTechItem(techGrid, tech));

	tech.append(techTitle, description, techGrid);
}

function _buildTechItem(grid, tech) {
	const item = document.createElement("div");
	item.classList.add("tech-item");

	const techIcon = document.createElement("img");
	techIcon.classList.add("tech-icon");
	techIcon.src = tech.icon;
	techIcon.alt = tech.name + "icon";

	const techName = document.createElement("div");
	techName.classList.add("tech-name");
	techName.textContent = tech.name;

	item.append(techIcon, techName);

	grid.appendChild(item);
}