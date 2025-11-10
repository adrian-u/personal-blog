import me from '../../../assets/images/me-cv.png';

export default function buildTitle() {

	const aboutTitle = document.getElementById("about-title");

	const aboutTitleDiv = document.createElement("div");
	aboutTitleDiv.classList.add("about-title", "fade-in");

	const picture = document.createElement("img");
	picture.src = me;
	picture.alt = "Profile Picture";
	picture.classList.add("profile-img");

	const title = document.createElement("h1");
	title.textContent = "Software Developer & Investor";

	aboutTitleDiv.append(picture, title);

	aboutTitle.appendChild(aboutTitleDiv);
}