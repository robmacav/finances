import { apiUrl } from "@/lib/api";

export async function fetchMostFrequentsByMonthYear(monthYear: string) {
    const res = await fetch(
        `${apiUrl}/reports/expenses/most-frequents-by-month-year?month_year=${monthYear}`,
        {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            "Authorization": import.meta.env.VITE_API_TOKEN
            }
        }
    );

    const json = await res.json();

    return json;
}
