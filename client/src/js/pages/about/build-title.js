import anonymous from '../../../assets/images/anonymous.png';

export default function buildTitle(data) {
    return `
	<div class="about-title">
	  <img src="${data.image ?? anonymous}" alt="Profile Picture" class="profile-img">
	  <h1 class="hero-title">${data.title}</h1>
	</div>
	`;
}