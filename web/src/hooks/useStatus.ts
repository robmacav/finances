import { useEffect, useState, useCallback } from 'react';
import type { Status } from '../../types/Status';
import { fetchStatuses } from '../api/status';

type UseStatusResult = {
  data: Status[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export function useStatus(): UseStatusResult {
  const [data, setData] = useState<Status[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadStatuses = useCallback(() => {
    setLoading(true);
    setError(null);

    fetchStatuses()
      .then((res) => {
        setData(res.statuses);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Erro ao carregar status');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadStatuses();
  }, [loadStatuses]);

  return {
    data,
    loading,
    error,
    refetch: loadStatuses,
  };
}
