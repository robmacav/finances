import { useEffect, useState } from 'react';
import { fetchIncomesExpensesAvailableByMonthYear } from '../../../api/utils/dashboard/fetchIncomesExpensesAvailableByMonthYear';

export interface IncomesExpensesData {
  incomes: string;
  expenses: string;
  available: string;
}

export function useIncomesExpensesAvailableByMonthYear(monthYear: string) {
  const [data, setData] = useState<IncomesExpensesData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!monthYear) return;

    setLoading(true);
    setError(null);

    fetchIncomesExpensesAvailableByMonthYear(monthYear)
      .then((res) => {
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
