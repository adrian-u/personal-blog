export default function buildTitle(data) {
    return `
	<div class="about-title">
	  <img src="${data.image ?? 'assets/images/anonymous.png'}" alt="Profile Picture" class="profile-img">
	  <h1 class="hero-title">${data.title}</h1>
	</div>
	`;
}