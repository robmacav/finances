import { apiUrl } from "@/lib/api";

export async function fetchAllCurrentWeek() {
    const res = await fetch(`${apiUrl}/reports/expenses/all-current-week`);

    console.log("current")

    const json = await res.json();

    return json;
}
