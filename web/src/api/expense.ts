import { apiUrl } from "@/lib/api";

import type { Expense } from '../../types/Expense';

type FetchExpensesResponse = {
  current_page: number;
  total_pages: number;
  total_count: number;
  expenses: Expense[];
};

export async function fetchExpenses(month_year: string): Promise<FetchExpensesResponse> {
  let currentPage = 1;
  let totalPages = 1;
  const allExpenses: Expense[] = [];

  do {
    let url: string;

    if (month_year?.trim()) {
      url = `${apiUrl}/reports/expenses/all-by-month-year?month_year=${encodeURIComponent(month_year)}&page=${currentPage}`;
    } else {
      url = `${apiUrl}/expenses?page=${currentPage}`;
    }

    const res = await fetch(url);

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

export async function deleteExpense(id: string) { 
  const res = await fetch(`${apiUrl}/v1/expenses/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error(`Erro ao excluir despesa com ID ${id}`);
  }

  return res.json();
}


