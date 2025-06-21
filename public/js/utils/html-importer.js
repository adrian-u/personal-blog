"use strict";

// Utility function to import HTML files
// Definition with types: function htmlImporter(id: string, path: string): void
export default function htmlImporter(id, path) {
    fetch(path)
        .then(res => res.text())
        .then(html => {
            document.getElementById(id).innerHTML = html;
        });
}