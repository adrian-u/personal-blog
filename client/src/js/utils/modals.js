import logger from "./logger";

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  'object',
  'embed',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable]'
].join(',');

let _activeModal = null;
let _boundKeyHandler = null;

function _getFocusableElements(container) {
  if (!container) return [];
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTORS))
    .filter(el => el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length);
}

function _handleKeydown(e) {
  if (!_activeModal) return;
  if (e.key === 'Escape') {
    e.preventDefault();
    closeModal(_activeModal);
    return;
  }

  if (e.key === 'Tab') {
    const focusable = _getFocusableElements(_activeModal);
    if (focusable.length === 0) {
      e.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first || !_activeModal.contains(document.activeElement)) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }
}

export function openModalById(modalId, focusSelector) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  try {
    window.__lastFocusedElement = document.activeElement;
  } catch (e) { }

  modal.classList.add('show');
  modal.classList.remove('hidden');

  _activeModal = modal;
  if (!_boundKeyHandler) {
    _boundKeyHandler = _handleKeydown.bind(this);
    document.addEventListener('keydown', _boundKeyHandler);
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      try {
        let target = null;
        if (focusSelector) target = modal.querySelector(focusSelector);
        if (!target) target = modal.querySelector(FOCUSABLE_SELECTORS);
        if (!target) target = modal;
        target.focus();

      } catch (error) {
        logger("error", "Error focusing modal element: ", error);
      }
    });
  });
}

export function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove('show');
  setTimeout(() => {
    modal.classList.add('hidden');
  }, 300);

  if (modal === _activeModal) {
    _activeModal = null;
    if (_boundKeyHandler) {
      document.removeEventListener('keydown', _boundKeyHandler);
      _boundKeyHandler = null;
    }
    try {
      if (window.__lastFocusedElement && typeof window.__lastFocusedElement.focus === 'function') {
        window.__lastFocusedElement.focus();
      }
    } catch (e) { }
  }
}

export function openLoginModal() { openModalById('login-modal', 'input, button, [tabindex]'); }
export function openArticlePreviewModal() { openModalById('article-preview-modal', '[data-action="close-modal"], button, a, [tabindex]'); }
export function openConfirmationModal() { openModalById('confirmation-modal', '#conf-header'); }
export function openReadModal() { openModalById('read-article-modal', '[data-action="close-modal"], button, a'); }
export function openInfoModal() { openModalById('info-modal', '#info-header'); }

