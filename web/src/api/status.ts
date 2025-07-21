import type { Status } from '../../types/Status';

type FetchstatusesResponse = {
  current_page: number;
  total_pages: number;
  total_count: number;
  statuses: Status[];
};

export async function fetchStatuses(): Promise<FetchstatusesResponse> {
  let currentPage = 1;
  let totalPages = 1;
  const allStatuses: Status[] = [];

  do {
    const res = await fetch(`http://localhost:3000/v1/status?page=${currentPage}`);

    if (!res.ok) {
      throw new Error(`Erro ao buscar página ${currentPage}`);
    }

    const json = await res.json() as {
      current_page: number;
      total_pages: number;
      total_count: number;
      statuses: Status[];
    };

    allStatuses.push(...json.statuses);

    totalPages = json.total_pages;
    currentPage++;
  } while (currentPage <= totalPages);

  return {
    current_page: 1,
    total_pages: totalPages,
    total_count: allStatuses.length,
    statuses: allStatuses,
  };
}
