import { MDEditor } from "@pardnchiu/nanomd";

export default function buildArticleEditor(content = "") {

    const articleEditor = document.getElementById('article-editor');

    const nanomdWrapperDiv = document.createElement("div");
    nanomdWrapperDiv.className = "nanomd-wrapper";

    const editorContainer = document.createElement("div");
    editorContainer.id = "nanomd-editor";

    articleEditor.appendChild(nanomdWrapperDiv);

    nanomdWrapperDiv.appendChild(editorContainer);

    const domEditor = new MDEditor({
        id: "nanomd-editor",
        defaultContent: content,
        hotKey: 1,
        preventRefresh: 0,
        tabPin: 1,
        wrap: 1,
        autosave: 1,
        style: {
            mode: "dark",
            fill: 0,
            fontFamily: "Inter",
            focus: {
                backgroundColor: "var(--color-primary-background)",
                color: "var(--color-primary)"
            }

        }
    });

    return domEditor;
}