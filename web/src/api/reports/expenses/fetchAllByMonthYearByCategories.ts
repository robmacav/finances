import { apiUrl } from "@/lib/api";

export async function fetchAllByMonthYearByCategories(monthYear: string) {
    const res = await fetch(
        `${apiUrl}/reports/expenses/all-by-month-year-by-category?month_year=${monthYear}`,
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
