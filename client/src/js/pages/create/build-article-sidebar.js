export default function buildCreateArticleSideBar() {

    return `
        <button class="new-draft-btn" onclick="createNewDraft()">
            New Article
        </button>

        <h2>
            Drafts
        </h2>

        <div class="drafts-list" id="draftsList">
            <div class="draft-item active" onclick="loadDraft('1')">
                <div class="draft-title">Building a Portfolio Tracker</div>
                <div class="draft-meta">
                    <span>Dec 15, 2024</span>
                    <span class="draft-status draft">Draft</span>
                </div>
            </div>
            <div class="draft-item" onclick="loadDraft('2')">
                    <div class="draft-title">React State Management Tips</div>
                    <div class="draft-meta">
                        <span>Dec 12, 2024</span>
                        <span class="draft-status draft">Draft</span>
                    </div>
                </div>
                
                <div class="draft-item" onclick="loadDraft('3')">
                    <div class="draft-title">DeFi Development Guide</div>
                    <div class="draft-meta">
                        <span>Dec 10, 2024</span>
                        <span class="draft-status published">Published</span>
                    </div>
                </div>
        </div>
    `;
}