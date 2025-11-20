import logger from "./logger.js";

export default async function htmlImporter(id, path, callback) {
  try {
    const res = await fetch(path);
    const html = await res.text();
    const parser = new DOMParser();  
    const doc = parser.parseFromString(html, "text/html");

    if (id === 'body') {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = "";
      wrapper.appendChild(doc.body.firstElementChild.cloneNode(true));
      document.body.appendChild(wrapper);
    } else {
      const container = document.getElementById(id);
      container.innerHTML = "";
      if (!container) {
        logger("warn", "HTML Importer", `Element with id '${id}' not found.`);
        return;
      }
      container.appendChild(doc.body.firstElementChild.cloneNode(true));
    }

    if (typeof callback === 'function') {
      requestAnimationFrame(callback);
    }
  } catch (err) {
    logger("error", "HTML Importer", `Failed to load ${path}:`, err);
  }
}