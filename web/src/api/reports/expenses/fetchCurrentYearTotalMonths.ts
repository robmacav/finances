import { apiUrl } from "@/lib/api";

export async function fetchCurrentYearTotalMonths() {
    const res = await fetch(
        `${apiUrl}/v1/reports/expenses/current-year-total-months`,
        {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            "Authorization": import.meta.env.VITE_API_TOKEN
        }
    });

    const json = await res.json();

    return json;
}
