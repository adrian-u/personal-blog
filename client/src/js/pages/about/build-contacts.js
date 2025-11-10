import emailIcon from "../../../assets/images/email.png";
import linkedInIcon from "../../../assets/images/linkedin.png";

export default function buildContacts() {
    const contacts = document.getElementById("contacts");

    const contactsTitle = document.createElement("h3");
    contactsTitle.classList.add("section-title");
    contactsTitle.textContent = "Get in Touch";

    const contactsDescription = document.createElement("p");
    contactsDescription.textContent = "If you want you can contact me here.";

    const contactsOptions = document.createElement("div");
    contactsOptions.classList.add("contact-options");

    const emailLink = document.createElement("a");
    emailLink.href = "mailto:adryian@outlook.it";
    emailLink.classList.add("contact-link");

    const emailImg = document.createElement("img");
    emailImg.src = emailIcon;
    emailImg.alt = "Email icon";
    emailImg.classList.add("contact-icon");
    emailLink.append(emailImg);

    const linkedIn = document.createElement("a");
    linkedIn.href = "https://www.linkedin.com/in/ungureanuab/";
    linkedIn.classList.add("contact-link");
    linkedIn.target = "blank";

    const linkedInImg = document.createElement("img");
    linkedInImg.src = linkedInIcon;
    linkedInImg.alt = "LinkedIn icon";
    linkedInImg.classList.add("contact-icon");
    linkedIn.append(linkedInImg);

    contactsOptions.append(emailLink, linkedIn);

    contacts.append(contactsTitle, contactsDescription, contactsOptions);
}