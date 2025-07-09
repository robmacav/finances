import { useEffect, useState } from 'react';
import type { MonthAvailables } from '../../../../types/utils/expenses/MonthAvailables';
import { fetchUtilsExpensesMonthAvailables } from '../../../api/utils/expenses/monthAvailables';

type UseCategoryResult = {
  data: MonthAvailables[];
  loading: boolean;
  error: string | null;
};

export function useMonthAvailables(): UseCategoryResult {
  const [data, setData] = useState<MonthAvailables[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUtilsExpensesMonthAvailables()
      .then((res) => {
        setData(res.months);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { data: data || [], loading, error };
}
