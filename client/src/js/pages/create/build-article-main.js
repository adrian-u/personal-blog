export default function buildCreateArticleMain() {
    return `
        <main class="editor-container">
            <div class="editor-header">
                <h1 class="editor-title">Create New Article</h1>

                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Title</label>
                        <input type="text" class="form-input" id="articleTitle" placeholder="Enter article title..." value="">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Icon</label>
                        <select class="form-input select-input" name="icons" id="icons">
                            <option class="icon-option" value="graph" >📊</option>
                            <option class="icon-option" value="pc">💻</option>
                            <option class="icon-option" value="rocket">🚀</option>
                            <option class="icon-option" value="star">⭐</option>
                            <option class="icon-option" value="fire">🔥</option>
                            <option class="icon-option" value="target">🎯</option>
                            <option class="icon-option" value="mobile">📱</option>
                            <option class="icon-option" value="light-bulb">💡</option>
                        </select>
                    </div>
                </div>

                <div class="form-group full-width">
                    <label class="form-label">Short Description</label>
                    <textarea class="form-input form-textarea" id="articleDescription" placeholder="Brief description of your article..."></textarea>
                </div>

                <div class="form-group full-width">
                    <label class="form-label">Tags</label>
                    <div class="tags-input-container">
                        <div class="tags-display" id="tagsDisplay">
                            <div class="tag-item">React <span class="tag-remove" onclick="removeTag('React')">×</span></div>
                            <div class="tag-item">Node.js <span class="tag-remove" onclick="removeTag('Node.js')">×</span></div>
                            <div class="tag-item">Finance <span class="tag-remove" onclick="removeTag('Finance')">×</span></div>
                        </div>
                        <input type="text" class="form-input" id="tagInput" placeholder="Add tags (press Enter to add)..." onkeypress="addTag(event)">
                    </div>
                </div>
            </div>

            <div class="editor-pane">
                <h3>Markdown Editor</h3>
                <textarea class="markdown-textarea" id="markdownContent" placeholder="Write the article">
                </textarea>
            </div>
        </main>
    `;
}