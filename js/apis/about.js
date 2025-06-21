export default async function loadAboutData() {

	const res = await fetch('http://127.0.0.1:8080/api/v1/about');
	return await res.json();

}