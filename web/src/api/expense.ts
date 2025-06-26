import type { Expense } from '../../types/Expense';

type FetchExpensesResponse = {
  current_page: number;
  total_pages: number;
  total_count: number;
  expenses: Expense[];
};

export async function fetchExpenses(): Promise<FetchExpensesResponse> {
  let currentPage = 1;
  let totalPages = 1;
  const allExpenses: Expense[] = [];

  do {
    const res = await fetch(`http://localhost:3000/v1/expenses?page=${currentPage}`);

    if (!res.ok) {
      throw new Error(`Erro ao buscar página ${currentPage}`);
    }

    const json = await res.json() as {
      current_page: number;
      total_pages: number;
      total_count: number;
      expenses: Expense[];
    };

    allExpenses.push(...json.expenses);

    totalPages = json.total_pages;
    currentPage++;
  } while (currentPage <= totalPages);

  return {
    current_page: 1,
    total_pages: totalPages,
    total_count: allExpenses.length,
    expenses: allExpenses,
  };
}

