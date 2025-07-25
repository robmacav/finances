import { apiUrl } from "@/lib/api";

export async function fetchIncomesExpensesTotalMonthsByYear(year: string) {
  const response = await fetch(
    `${apiUrl}/utils/dashboard/incomes-expenses-total-months-by-year?month_year=${year}`
  );

  if (!response.ok) {
    throw new Error('Erro ao buscar dados de receitas e despesas');
  }

  const data = await response.json();

  return data;
}
