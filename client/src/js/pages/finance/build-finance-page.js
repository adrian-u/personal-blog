import buildFinanceHeader from "./build-finance-header";
import buildFinanceOverview from "./build-finance-overview";

export default async function buildFinancePage() {
    const header = document.getElementById('finance-header');
    const finance = document.getElementById('finance-overview');

    header.appendChild(buildFinanceHeader());
    finance.appendChild(await buildFinanceOverview());
}