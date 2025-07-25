import { apiUrl } from "@/lib/api";
import { type IncomesExpensesData } from '../../../hooks/utils/dashboard/useIncomesExpensesAvailableByMonthYear';

export async function fetchIncomesExpensesAvailableByMonthYear(monthYear: string): Promise<IncomesExpensesData> {
  const response = await fetch(
    `${apiUrl}/utils/dashboard/incomes-expenses-available-by-month-year?month_year=${monthYear}`
  );

  if (!response.ok) {
    throw new Error('Erro ao buscar dados de receitas e despesas');
  }

  const data: IncomesExpensesData = await response.json();

  return data;
}
