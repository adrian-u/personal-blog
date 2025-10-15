import logger from "./logger.js";

export default async function htmlImporter(id, path, callback) {
  try {
    const res = await fetch(path);
    const html = await res.text();

    if (id === 'body') {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = html;
      document.body.appendChild(wrapper);
    } else {
      const container = document.getElementById(id);
      if (!container) {
        logger("warn", "HTML Importer", `Element with id '${id}' not found.`);
        return;
      }
      container.innerHTML = html;
    }

    if (typeof callback === 'function') {
      requestAnimationFrame(callback);
    }
  } catch (err) {
    logger("error", "HTML Importer", `Failed to load ${path}:`, err);
  }
}