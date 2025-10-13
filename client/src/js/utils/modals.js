export function openLoginModal() {
    const modal = document.getElementById("login-modal");
    modal.classList.add("show");
    modal.classList.remove("hidden");
}

export function openArticlePreviewModal() {
    const modal = document.getElementById("article-preview-modal");
    modal.classList.add("show");
    modal.classList.remove("hidden");
}

export function handleEscape(event) {

  if (event.key !== 'Escape') return;
  const openModal = document.querySelector('.modal-container.show');
  if (openModal) {
    closeModal(openModal);
  }
}

export function closeModal(modal) {
  modal.classList.remove('show');
  setTimeout(() => {
    modal.classList.add('hidden');
  }, 300);
}