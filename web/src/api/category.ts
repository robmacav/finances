import { apiUrl } from "@/lib/api";
import type { Category } from '../../types/Category';

type FetchCategoriesResponse = {
  current_page: number;
  total_pages: number;
  total_count: number;
  categories: Category[];
};

export async function fetchCategories(): Promise<FetchCategoriesResponse> {
  let currentPage = 1;
  let totalPages = 1;
  const allCategories: Category[] = [];

  do {
    const res = await fetch(
      `${apiUrl}/categories?page=${currentPage}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": import.meta.env.VITE_API_TOKEN
        }
      }
    );

    if (!res.ok) {
      throw new Error(`Erro ao buscar página ${currentPage}`);
    }

    const json = await res.json() as {
      current_page: number;
      total_pages: number;
      total_count: number;
      categories: Category[];
    };

    allCategories.push(...json.categories);

    totalPages = json.total_pages;
    currentPage++;
  } while (currentPage <= totalPages);

  return {
    current_page: 1,
    total_pages: totalPages,
    total_count: allCategories.length,
    categories: allCategories,
  };
}
