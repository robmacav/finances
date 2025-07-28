import { useEffect, useState } from 'react';
import { fetchAllCurrentWeek } from '../../../api/reports/expenses/fetchAllCurrentWeek';

import type { Expense } from 'types/Expense';

type UseAvailableResult = {
  data: Expense | null;
  loading: boolean;
  error: string | null;
};

export function useAllCurrentWeek(): UseAvailableResult {
  const [data, setData] = useState<Expense | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllCurrentWeek()
      .then((res: Expense) => {
        setData(res);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message || 'Erro ao buscar dados');
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}
