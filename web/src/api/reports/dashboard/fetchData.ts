import { type DashboardData } from "../../../../types/reports/DashboardData"

import { apiUrl } from "@/lib/api";

export const fetchData = async (monthYear: string): Promise<DashboardData> => {
  const response = await fetch(`${apiUrl}/reports/dashboard/data?month_year=${monthYear}`);

  if (!response.ok) {
    throw new Error(`Erro ao buscar dados do dashboard: ${response.statusText}`);
  }

  const data = await response.json();
  return data as DashboardData;
};
