import { apiUrl } from "@/lib/api";

export async function fetchAllByMonthYearByCategories(monthYear: string) {
    const res = await fetch(`${apiUrl}/reports/expenses/all-by-month-year-by-category?month_year=${monthYear}`);

    const json = await res.json();

    return json;
}
