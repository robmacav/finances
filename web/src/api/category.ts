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
    const res = await fetch(`http://localhost:3000/v1/categories?page=${currentPage}`);

    if (!res.ok) {
      throw new Error(`Erro ao buscar página ${currentPage}`);
    }

    const json = await res.json() as {
      current_page: number;
      total_pages: number;
      total_count: number;
      expenses: Category[];
    };

    allCategories.push(...json.expenses);

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

