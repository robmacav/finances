import { useEffect, useState } from 'react';
import { fetchCurrentYearTotalMonths } from '../../../api/reports/expenses/fetchCurrentYearTotalMonths';

type AvailableData = {
  month_year: string;
  total: string
};

type UseAvailableResult = {
  data: AvailableData | null;
  loading: boolean;
  error: string | null;
};

export function useCurrentYearTotalMonths(): UseAvailableResult {
  const [data, setData] = useState<AvailableData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCurrentYearTotalMonths()
      .then((res: AvailableData) => {
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
