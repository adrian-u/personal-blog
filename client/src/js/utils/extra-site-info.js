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
    <span class="icons-from">
        The non-tech icons are taken from <a href="https://www.flaticon.com/" target="blank"> <img src="${flaticon}" class="png" alt="Flaticon Icon" /> </a>
    </span>
    <span class="icons-from">
        Home icons created by Vectors Market - Flaticon <a href="https://www.flaticon.com/free-icons/home" target="blank" title="home icons">
            <img src="/assets/images/home.png" class="png" alt="Home Icon" />
        </a>
    </span>
    <span class="icons-from">
       Young icons created by Freepik - Flaticon <a href="https://www.flaticon.com/free-icons/young" target="blank" title="young icons">
            <img src="/assets/images/about.png" class="png" alt="About Icon" />
        </a>
    </span>
     <span class="icons-from">
       Execution icons created by kliwir art - Flaticon <a href="https://www.flaticon.com/free-icons/execution" target="blank" title="execution icons">
            <img src="/assets/images/projects.png" class="png" alt="Projects Icon" />
        </a>
    </span>
    <span class="icons-from">
       Budget icons created by Freepik - Flaticon <a href="https://www.flaticon.com/free-icons/budget" target="blank" title="budget icons">
            <img src="/assets/images/finance.png" class="png" alt="Finance Icon" />
        </a>
    </span>
    <span class="icons-from">
       Draw icons created by Freepik - Flaticon <a href="https://www.flaticon.com/free-icons/draw" target="blank" title="draw icons">
            <img src="/assets/images/create.png" class="png" alt="Create Icon" />
        </a>
    </span>
    <span class="icons-from">
       Development icons created by Design Circle - Flaticon <a href="https://www.flaticon.com/free-icons/development" target="blank" title="development icons">
            <img src=${development} class="png" alt="Development Icon" />
        </a>
    </span>
    <span class="icons-from">
       Stock icons created by ultimatearm - Flaticon <a href="https://www.flaticon.com/free-icons/stock" target="blank" title="stock icons">
            <img src=${stock} class="png" alt="Stock Icon" />
        </a>
    </span> 
    <span class="icons-from">
       Email icons created by Fathema Khanom - Flaticon <a href="https://www.flaticon.com/free-icons/email" target="blank" title="email icons">
            <img src=${email} class="png" alt="Email Icon" />
        </a>
    </span>
    <span class="icons-from">
       Linkedin icons created by Freepik - Flaticon <a href="https://www.flaticon.com/free-icons/linkedin" target="blank"  title="linkedin icons">
            <img src=${linkedin} class="png" alt="Linkedin Icon" />
        </a>
    </span>
    <span class="icons-from">
       Rating icons created by pocike - Flaticon <a href="https://www.flaticon.com/free-icons/rating" target="blank"  title="rating icons">
            <img src="${starEmpty}" class="png star-icon" data-original="${starEmpty}" data-full="${starFull}" alt="Rating Icon" />
        </a>
    </span> 
    <span class="icons-from">
       Heart icons created by Kiranshastry - Flaticon <a href="https://www.flaticon.com/free-icons/heart" target="blank"  title="heart icons">
            <img src=${heart} class="png" alt="Heart Icon" />
        </a>
    </span> 
    `

    const star = document.querySelector('.star-icon');

    star.addEventListener('mouseenter', () => {
        star.src = star.dataset.full;
    });

    star.addEventListener('mouseleave', () => {
        star.src = star.dataset.original;
    });

    closeButton.addEventListener("click", () => {
        closeModal(modalContainer);
    });
}