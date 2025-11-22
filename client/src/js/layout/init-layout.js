import htmlImporter from "../utils/html-importer.js";
import { closeModal, openLoginModal } from "../utils/modals.js";
import { authWithProvider } from "../auth/auth.js";
import { userAvatar } from "../utils/user-details.js";
import { isCreator, getCurrentUser } from "../context/user-context.js";

export async function initNavbar() {
  await htmlImporter("navbar-container", "/components/navbar.html", async () => {
    const loginBtn = document.getElementById("login-btn");
    const createPage = document.getElementById("create-page");
    const profileNavbar = document.getElementById("profile");
    const user = await getCurrentUser();

    const toggle = document.getElementById("menu-toggle");
    const navbar = document.getElementById("navbar");
    const logo = document.getElementById("logo");
    const logoCollapsed = document.getElementById("logo-small");

    toggle.addEventListener("click", () => {
      navbar.classList.add("collapsed");
      logo.classList.add("collapsed");
      toggle.classList.add("remove-from-layout");
      logoCollapsed.classList.add("show");
    });

    logoCollapsed.addEventListener("click", () => {
      navbar.classList.remove("collapsed");
      logo.classList.remove("collapsed");
      toggle.classList.remove("remove-from-layout");
      logoCollapsed.classList.remove("show");
    });

    if (!loginBtn || !profileNavbar) return;

    if (user) {
      loginBtn.style.display = "none";
      profileNavbar.style.display = "flex";
      createPage.style.display = "flex";
      userAvatar(user);
      isCreator() ? createPage.style.display = "flex" : createPage.style.display = "none";
    } else {
      loginBtn.style.display = "flex";
      profileNavbar.style.display = "none";
    }

    loginBtn.addEventListener("click", openLoginModal);
  });
}

export async function initLoginModal() {
  await htmlImporter("body", "/components/login-modal.html", () => {
    const modal = document.getElementById("login-modal");
    if (!modal) return;

    modal.addEventListener("click", (e) => {
      if (e.target.closest("#btn-close-modal")) {
        closeModal(modal);
        return;
      }
      if (e.target.closest("[data-provider]")) {
        const provider = e.target.closest("[data-provider]").dataset.provider;
        authWithProvider(provider);
        closeModal(modal);
      }
    });
  });
}

export function setActiveNav(path) {
  const navItems = document.querySelectorAll("#nav-menu .navbar-buttons");

  navItems.forEach(item => {
    const href = item.getAttribute("href");
    const isActive = path === href || path.startsWith(href + "/");

    if (isActive) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

export async function initConfirmationModal() {
  await htmlImporter("body", "/components/confirmation-modal.html");
}