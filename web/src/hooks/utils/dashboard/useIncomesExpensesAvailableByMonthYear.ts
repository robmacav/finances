import { useEffect, useState } from 'react';
import { fetchIncomesExpensesAvailableByMonthYear } from '../../../api/utils/dashboard/fetchIncomesExpensesAvailableByMonthYear';

export interface IncomesExpensesData {
  incomes: string;
  expenses: string;
  available: string;
}

// cache em memória simples
const cache: Record<string, IncomesExpensesData> = {};

export function useIncomesExpensesAvailableByMonthYear(monthYear: string) {
  const [data, setData] = useState<IncomesExpensesData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!monthYear) return;

    // Se já estiver em cache, retorna imediatamente
    if (cache[monthYear]) {
      setData(cache[monthYear]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetchIncomesExpensesAvailableByMonthYear(monthYear)
      .then((res) => {
        cache[monthYear] = res; // salva no cache
        setData(res);
      })
      .catch((err) => {
        setError(err.message || 'Erro ao buscar dados');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [monthYear]);

  return { data, loading, error };
}
