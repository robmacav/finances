import { apiUrl } from "@/lib/api";
import { type Transaction } from "../../../../types/reports/Transaction";

type FetchTransactionsResponse = {
  current_page: number;
  total_pages: number;
  total_count: number;
  transactions: Transaction[];
};

export async function fetchByMonthYear(month_year: string): Promise<FetchTransactionsResponse> {
  let currentPage = 1;
  let totalPages = 1;
  const allTransactions: Transaction[] = [];

  do {
    const url = `${apiUrl}/reports/transactions/all-by-month-year?month_year=${encodeURIComponent(month_year)}&page=${currentPage}`;

    const res = await fetch(
      url,
      {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": import.meta.env.VITE_API_TOKEN
        }
      }
    );

    if (!res.ok) {
      throw new Error(`Erro ao buscar página ${currentPage} de transações`);
    }

    const json = await res.json() as FetchTransactionsResponse;

    allTransactions.push(...json.transactions);

    totalPages = json.total_pages;
    currentPage++;
  } while (currentPage <= totalPages);

  return {
    current_page: 1,
    total_pages: totalPages,
    total_count: allTransactions.length,
    transactions: allTransactions,
  };
}
