import { apiUrl } from "@/lib/api";

export async function fetchAllCurrentWeek() {
    const res = await fetch(`${apiUrl}/reports/expenses/all-current-week`);

    const json = await res.json();

    return json;
}
