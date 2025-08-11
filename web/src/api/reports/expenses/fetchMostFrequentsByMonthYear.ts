import { apiUrl } from "@/lib/api";

export async function fetchMostFrequentsByMonthYear(monthYear: string) {
    const res = await fetch(`${apiUrl}/reports/expenses/most-frequents-by-month-year?month_year=${monthYear}`);

    const json = await res.json();

    return json;
}
