import { useEffect, useState } from 'react';
import type { Meta } from '../../../../types/utils/transactions/Meta';
import { fetchMeta } from '../../../api/utils/transactions/fetchMeta';

type UseMetaResult = {
  data: any;
  loading: boolean;
  error: string | null;
};

export function useMeta(): UseMetaResult {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMeta()
      .then((res) => {
        setData(res.categories);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}
