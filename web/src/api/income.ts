import { apiUrl } from "@/lib/api";
import type { Income } from '../../types/Income';

type FetchIncomesResponse = {
  current_page: number;
  total_pages: number;
  total_count: number;
  incomes: Income[];
};

export async function fetchIncomes(month_year: string): Promise<FetchIncomesResponse> {
  let currentPage = 1;
  let totalPages = 1;
  const allIncomes: Income[] = [];

  do {
    let url: string;

    if (month_year?.trim()) {
      url = `${apiUrl}/reports/incomes/all-by-month-year?month_year=${encodeURIComponent(month_year)}&page=${currentPage}`;
    } else {
      url = `${apiUrl}/incomes?page=${currentPage}`;
    }

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Erro ao buscar página ${currentPage}`);
    }

    const json = await res.json() as {
      current_page: number;
      total_pages: number;
      total_count: number;
      incomes: Income[];
    };

    allIncomes.push(...json.incomes);

    totalPages = json.total_pages;
    currentPage++;
  } while (currentPage <= totalPages);

  return {
    current_page: 1,
    total_pages: totalPages,
    total_count: allIncomes.length,
    incomes: allIncomes,
  };
}


