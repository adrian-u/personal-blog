export default function buildSkills(techStack) {
	const tech = document.getElementById("about-skills");
	tech.classList.add("tech-section");

	const techTitle = document.createElement("h3");
	techTitle.classList.add("tech-title");
	techTitle.textContent = "Teck Stack";

	const techGrid = document.createElement("div");
	techGrid.classList.add("tech-grid");

	techStack.forEach(tech => _buildTechItem(techGrid, tech));

	tech.append(techTitle, techGrid);
}

function _buildTechItem(grid, tech) {
	const item = document.createElement("div");
	item.classList.add("tech-item");
	item.innerHTML = `
                <div class="tech-icon">${tech.icon}</div>
                <div class="tech-name">${tech.name}</div>
            `;
	grid.appendChild(item);
}