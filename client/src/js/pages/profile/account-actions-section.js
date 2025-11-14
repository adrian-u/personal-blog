import { deleteUser } from "../../apis/user";
import { getJWT, logout } from "../../auth/auth";
import { closeModal, openConfirmationModal } from "../../utils/modals";

export default function buildAccountActionsSection() {

    const accountActions = document.getElementById('account-actions');

    accountActions.innerHTML = `
        <div class="profile-buttons-box">
            <button id="logout" class="btn btn-green">Logout</button>
            <button id="delete-account" class="btn btn-danger">Delete</button>
        </div>
    `;

    if (!accountActions.dataset.listenerAttached) {
        accountActions.addEventListener("click", (e) => {
            if (e.target.matches("#logout")) _buildLogoutModal();
            if (e.target.matches("#delete-account")) _buildDeleteAccountModal();
        });
        accountActions.dataset.listenerAttached = true;
    }
}

function _buildLogoutModal() {

    const modalContainer = document.getElementById("confirmation-modal");
    const contentModal = modalContainer.querySelector("#confirmation-content");
    contentModal.classList.add("modal-confirmation");

    const modalHeader = contentModal.querySelector("#conf-header");
    const modalText = contentModal.querySelector("#conf-text");
    const confirmButton = contentModal.querySelector("#confirm");
    const cancelButton = contentModal.querySelector("#cancel");

    modalHeader.textContent = "Logout";
    modalText.innerHTML = `
    <span>Are you sure you want to logout?</span>`

    confirmButton.onclick = async () => {
        await logout();
        closeModal(modalContainer);
    };

    cancelButton.onclick = () => {
        closeModal(modalContainer);
    };

    openConfirmationModal();
}

function _buildDeleteAccountModal() {
    const modalContainer = document.getElementById("confirmation-modal");
    const contentModal = modalContainer.querySelector("#confirmation-content");
    contentModal.classList.add("modal-confirmation");

    const modalHeader = contentModal.querySelector("#conf-header");
    const modalText = contentModal.querySelector("#conf-text");
    const confirmButton = contentModal.querySelector("#confirm");
    const cancelButton = contentModal.querySelector("#cancel");

    modalHeader.textContent = "Delete Account";
    modalText.innerHTML = `
    <span>Are you sure you want to delete your account?</span>
    <br> 
    <span>This action cannot be undone.</span>`;


    confirmButton.onclick = async () => {
        await deleteUser();
        await logout();
        closeModal(modalContainer);
    };

    cancelButton.onclick = () => {
        closeModal(modalContainer);
    };

    openConfirmationModal();
}
