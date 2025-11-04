import { closeModal, openInfoModal } from "../../utils/modals";

export function extraSiteInfo() {
    const shipu = document.getElementById("shipu");
    const disclaimer = document.getElementById("disclaimer");
    const icons = document.getElementById("icons-provider");

    shipu.addEventListener("click", () => {
        _shipuInfo();
        openInfoModal();
    });

    disclaimer.addEventListener("click", () => {
        _disclaimerInfo();
        openInfoModal();
    });

    icons.addEventListener("click", () => {
        _iconsInfo();
        openInfoModal();
    });
}

function _shipuInfo() {
    const modalContainer = document.getElementById("info-modal");
    const contentModal = modalContainer.querySelector("#info-content");

    const modalHeader = contentModal.querySelector("#info-header");
    const modalText = contentModal.querySelector("#info-text");
    const closeButton = contentModal.querySelector("#close");

    modalHeader.textContent = "Shipu?";
    modalText.innerHTML = `
    <span>
        Hi! If you’ve ever wondered what Shipu means — 
        it’s simply the username I’ve been using online for years.
        I came up with it when I was 13, and it’s stuck with me ever since.
        I use it for games and most online platforms that
        ask for a username. I decided to use it here too,
        mainly because it fits nicely in the navbar.
    </span>`

    closeButton.addEventListener("click", () => {
        closeModal(modalContainer);
    });
}

function _disclaimerInfo() {
    const modalContainer = document.getElementById("info-modal");
    const contentModal = modalContainer.querySelector("#info-content");

    const modalHeader = contentModal.querySelector("#info-header");
    const modalText = contentModal.querySelector("#info-text");
    const closeButton = contentModal.querySelector("#close");

    modalHeader.textContent = "Disclaimer";
    modalText.innerHTML = `
    <span>
        A quick reminder for anyone reading my finance-related articles:
        I’m not a market guru, a visionary, or anything of that sort.
        I don’t hold any financial certifications, degrees, or formal education in finance.
        In my professional life, I’m a web developer — not someone who spends most of their time in the markets or financial industry.
        <br>
        <br>
        The financial articles I share here are meant to document my personal journey and opinions.
        My goal is to offer insights you might learn from, reflect on, or even disagree with — not to provide absolute truths or investment advice.
        <br>
        <br>
        When I mention specific stocks or trades, please don’t take that as a recommendation to buy or sell.
        These posts are for sharing experiences, not for giving financial guidance. Always do your own research and make your own decisions.
    </span>`

    closeButton.addEventListener("click", () => {
        closeModal(modalContainer);
    });
}

function _iconsInfo() {
    const modalContainer = document.getElementById("info-modal");
    const contentModal = modalContainer.querySelector("#info-content");

    const modalHeader = contentModal.querySelector("#info-header");
    const modalText = contentModal.querySelector("#info-text");
    const closeButton = contentModal.querySelector("#close");

    modalHeader.textContent = "Icons";
    modalText.innerHTML = `
    <span>
        All the icons are taken from https://www.flaticon.com/.
    </span>`

    closeButton.addEventListener("click", () => {
        closeModal(modalContainer);
    });
}