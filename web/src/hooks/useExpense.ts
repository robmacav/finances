import { useEffect, useState } from 'react';
import type { Expense } from '../../types/Expense';
import { fetchExpenses } from '../api/expense';

type UseExpenseResult = {
  data: Expense[] | null;
  loading: boolean;
  error: string | null;
};

export function useExpense(month_year: string): UseExpenseResult {
  const [data, setData] = useState<Expense[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExpenses(month_year)
      .then((res) => {
        setData(res.expenses);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}
