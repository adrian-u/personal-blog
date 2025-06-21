"use strict";

export default function htmlImporter(id, path) {
    fetch(path)
        .then(res => res.text())
        .then(html => {
            document.getElementById(id).innerHTML = html;
        });
}