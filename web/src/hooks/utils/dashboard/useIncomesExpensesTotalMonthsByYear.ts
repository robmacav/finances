import { fetchIncomesExpensesTotalMonthsByYear } from '@/api/utils/dashboard/fetchIncomesExpensesTotalMonthsByYear';
import { useEffect, useState } from 'react';

export interface IncomesExpensesData {
  incomes: string;
  expenses: string;
  available: string;
}

export function useIncomesExpensesTotalMonthsByYear(year: string) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!year) return;

    setLoading(true);
    setError(null);

    fetchIncomesExpensesTotalMonthsByYear(year)
      .then((res) => setData(res))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [year]);

  return { data, loading, error };
}
