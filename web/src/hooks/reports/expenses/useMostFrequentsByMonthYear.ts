import { useEffect, useState } from 'react';

import { fetchMostFrequentsByMonthYear } from '@/api/reports/expenses/fetchMostFrequentsByMonthYear';

type AvailableData = {
  summary: string;
  qtd: string;
  total: string;
};

type UseAvailableResult = {
  data: AvailableData | null;
  loading: boolean;
  error: string | null;
};

export function useMostFrequentsByMonthYear(monthYear: string): UseAvailableResult {
  const [data, setData] = useState<AvailableData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  

  useEffect(() => {
    fetchMostFrequentsByMonthYear(monthYear)
      .then((res: AvailableData) => {
        setData(res);
        setLoading(false);""
      })
      .catch((err: Error) => {
        setError(err.message || 'Erro ao buscar dados');
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}
