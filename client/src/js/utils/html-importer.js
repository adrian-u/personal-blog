"use strict";

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
        console.warn(`Element with id '${id}' not found.`);
        return;
      }
      container.innerHTML = html;
    }

    if (typeof callback === 'function') callback();
  } catch (err) {
    console.error(`Failed to load ${path}:`, err);
  }
}