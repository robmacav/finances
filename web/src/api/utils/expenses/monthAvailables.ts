import { apiUrl } from "@/lib/api";
import type { MonthAvailables } from '../../../../types/utils/expenses/MonthAvailables';

type FetchCategoriesResponse = {
  current_page: number;
  total_pages: number;
  total_count: number;
  months: MonthAvailables[];
};

export async function fetchUtilsExpensesMonthAvailables(): Promise<FetchCategoriesResponse> {
  let currentPage = 1;
  let totalPages = 1;
  const allMonths: MonthAvailables[] = [];

  do {
    const res = await fetch(`${apiUrl}/v1/utils/expenses/categories?page=${currentPage}`);

    if (!res.ok) {
      throw new Error(`Erro ao buscar página ${currentPage}`);
    }

    const json = await res.json() as {
      current_page: number;
      total_pages: number;
      total_count: number;
      months: MonthAvailables[];
    };

    allMonths.push(...json.months);

    totalPages = json.total_pages;
    currentPage++;
  } while (currentPage <= totalPages);

  return {
    current_page: 1,
    total_pages: totalPages,
    total_count: allMonths.length,
    months: allMonths,
  };
}
