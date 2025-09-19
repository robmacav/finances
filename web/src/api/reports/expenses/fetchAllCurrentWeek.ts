import { apiUrl } from "@/lib/api";

export async function fetchAllCurrentWeek() {
    const res = await fetch(
        `${apiUrl}/reports/expenses/all-current-week`,
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
