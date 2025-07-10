export async function fetchAllByMonthYearByCategories(monthYear: string) {
    const res = await fetch(`http://localhost:3000/v1/reports/expenses/all-by-month-year-by-category?month_year=${monthYear}`);

    const json = await res.json();

    return json;
}
