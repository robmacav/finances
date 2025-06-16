import { useEffect, useState } from 'react';
import type { Expense } from '../../types/Expense';
import { fetchExpenses } from '../api/expense';

export function useExpenses() {
  const [data, setData] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Iniciando...")

    fetchExpenses()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
