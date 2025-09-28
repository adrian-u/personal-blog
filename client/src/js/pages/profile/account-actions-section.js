import { logout } from "../../auth/auth";

export default function buildAccountActionsSection() {

    const accountActions = document.getElementById('account-actions');

    accountActions.innerHTML = `
        <div class="profile-buttons-box">
            <button id="logout" class="btn btn-flex btn-green">Logout</button>
            <button id="delete-account" class="btn btn-flex btn-danger">Delete Account</button>
        </div>
    `;

    _addButtonEvents();
}

function _addButtonEvents() {
    const logoutButton = document.getElementById('logout');
    const deleteAccount = document.getElementById('delete-account');

    logoutButton.addEventListener('click', () => {
        logout();
    })

    deleteAccount.addEventListener('click', () => {
        alert("Delete Account");
    });
}
