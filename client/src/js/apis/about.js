export default async function loadAboutData() {

	const res = await fetch(`${import.meta.env.VITE_API_URL}/about`);
	return await res.json();

}