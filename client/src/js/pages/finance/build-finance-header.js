export default function buildFinanceHeader() {

    const financeHeader = document.createElement("div");
    financeHeader.classList.add("finance-header");

    const financeTitle = document.createElement("h1");
    financeTitle.classList.add("finance-title");
    financeTitle.textContent = "Finance";

    const financeSubtitle = document.createElement("p");
    financeSubtitle.classList.add("finance-subtitle");
    financeSubtitle.textContent = "Hi! This is where I share my financial journey - how it started, why I began, what my goals are, and how things are going along the way."

    financeHeader.append(financeTitle, financeSubtitle);
    return financeHeader;
}