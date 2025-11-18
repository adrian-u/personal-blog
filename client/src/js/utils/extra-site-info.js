import flaticon from "../../assets/images/flaticon.png";
import development from "../../assets/images/app-development.png";
import stock from "../../assets/images/stock.png";
import email from "../../assets/images/email.png";
import linkedin from "../../assets/images/linkedin.png";
import starEmpty from "../../assets/images/star.png";
import starFull from "../../assets/images/star-full.png";
import heart from "../../assets/images/heart.png";

import { closeModal, openInfoModal } from "./modals";

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
        Hi! If you’ve ever wondered what Shipu means, 
        it’s simply the username I’ve been using online for years.
        I came up with it when I was 13, and it’s stuck with me ever since.
        I use it for games and most online platforms that
        ask for a username. I decided to use it here too.
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
        A quick reminder for anyone reading my finance-related articles.
        <br>
        <br>
        I’m not a market guru, a visionary, or anything of that sort.
        I don’t hold any financial certifications, degrees, or formal education in finance.
        In my professional life, I’m a web developer, not someone who spends most of their time in the markets or financial industry.
        <br>
        <br>
        The financial articles I share here are meant to document my personal journey and opinions.
        My goal is to offer insights you might learn from, reflect on, or even disagree with, not to provide absolute truths or investment advice.
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

    const icons = [
        { desc: "The non-tech icons are taken from", href: "https://www.flaticon.com/", src: flaticon, alt: "Flaticon Icon", title: "flaticon" },
        { desc: "Home icons created by Vectors Market - Flaticon", href: "https://www.flaticon.com/free-icons/home", src: "/assets/images/home.png", alt: "Home Icon", title: "home icons" },
        { desc: "Young icons created by Freepik - Flaticon", href: "https://www.flaticon.com/free-icons/young", src: "/assets/images/about.png", alt: "About Icon", title: "young icons" },
        { desc: "Execution icons created by kliwir art - Flaticon", href: "https://www.flaticon.com/free-icons/execution", src: "/assets/images/projects.png", alt: "Execution Icon", title: "execution icons" },
        { desc: "Budget icons created by Freepik - Flaticon", href: "https://www.flaticon.com/free-icons/budget", src: "/assets/images/finance.png", alt: "Finance Icon", title: "budget icons" },
        { desc: "Draw icons created by Freepik - Flaticon", href: "https://www.flaticon.com/free-icons/draw", src: "/assets/images/create.png", alt: "Create Icon", title: "draw icons" },
        { desc: "Development icons created by Design Circle - Flaticon", href: "https://www.flaticon.com/free-icons/development", src: development, alt: "Development Icon", title: "development icons" },
        { desc: "Stock icons created by ultimatearm - Flaticon", href: "https://www.flaticon.com/free-icons/stock", src: stock, alt: "Stock Icon", title: "stock icons" },
        { desc: "Email icons created by Fathema Khanom - Flaticon", href: "https://www.flaticon.com/free-icons/email", src: email, alt: "Email Icon", title: "email icons" },
        { desc: "Linkedin icons created by Freepik - Flaticon", href: "https://www.flaticon.com/free-icons/linkedin", src: linkedin, alt: "LinkedIn Icon", title: "linkedin icons" },
        { desc: "Rating icons created by pocike - Flaticon", href: "https://www.flaticon.com/free-icons/rating", src: starEmpty, alt: "Rating Icon", title: "rating icons", isStar: true, full: starFull },
        { desc: "Heart icons created by Kiranshastry - Flaticon", href: "https://www.flaticon.com/free-icons/heart", src: heart, alt: "Heart Icon", title: "heart icons" },
        { desc: "Collapse icons created by Freepik - Flaticon", href: "https://www.flaticon.com/free-icons/collapse", src: "/assets/images/grid.png", alt: "sidebar icon", title: "collapse icons" }
    ];

    const modalContainer = document.getElementById("info-modal");
    const contentModal = modalContainer.querySelector("#info-content");

    const modalHeader = contentModal.querySelector("#info-header");
    const modalText = contentModal.querySelector("#info-text");
    const closeButton = contentModal.querySelector("#close");

    modalHeader.textContent = "Icons";
    modalText.innerHTML = "";
    const iconsDiv = document.createElement("div");

    icons.forEach(icon => {
        const span = document.createElement("span");
        span.classList.add("icons-from");

        const link = document.createElement("a");
        link.href = icon.href;
        link.title = icon.title;
        link.target = "blank";

        const img = document.createElement("img");
        img.src = icon.src;
        img.classList.add("png");
        img.alt = icon.alt;

        if (icon.isStar) {
            img.classList.add("star-icon");
            img.dataset.original = icon.src;
            img.dataset.full = icon.full;
        }

        link.appendChild(img);

        span.append(icon.desc + " ", link);
        iconsDiv.appendChild(span);
    });

    modalText.appendChild(iconsDiv);

    const starIcon = modalText.querySelector(".star-icon");
    if (starIcon) {
        starIcon.addEventListener("mouseenter", () => {
            starIcon.src = starIcon.dataset.full;
        });
        starIcon.addEventListener("mouseleave", () => {
            starIcon.src = starIcon.dataset.original;
        });
    }

    closeButton.addEventListener("click", () => {
        closeModal(modalContainer);
    });
}