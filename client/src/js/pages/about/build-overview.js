import development from "../../../assets/images/app-development.png";
import investor from "../../../assets/images/stock.png";

export default function createOverview(descriptions) {

	const overview = document.getElementById("about-overview");

	const twoColumn = document.createElement("div");
	twoColumn.classList.add("two-column", "fade-in");

	twoColumn.append(_createAboutCard("The Developer", descriptions.developer, "developer"),
		_createAboutCard("The Investor", descriptions.investor, "investor"));

	overview.appendChild(twoColumn);

}

function _createAboutCard(title, description, type) {

	const content = document.createElement("div");
	content.classList.add("content-card");

	const header = document.createElement("h3");
	const img = document.createElement("img");
	img.classList.add("png");
	img.src = type === "developer" ? development : investor;
	img.alt = `${type} icon`;

	const text = document.createTextNode(title);

	header.append(img, text);

	const desc = document.createElement("p");
	desc.textContent = description;

	content.append(header, desc);
	return content;
}