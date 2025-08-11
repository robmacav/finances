import { apiUrl } from "@/lib/api";

export async function fetchCurrentYearTotalMonths() {
    const res = await fetch(`${apiUrl}/v1/reports/expenses/current-year-total-months`);

    const json = await res.json();

    return json;
}
