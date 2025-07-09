export async function fetchCurrentYearTotalMonths() {
    const res = await fetch(`http://localhost:3000/v1/reports/expenses/current-year-total-months`);

    const json = await res.json();

    return json;
}
