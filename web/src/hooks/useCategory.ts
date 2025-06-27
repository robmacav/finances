import { useEffect, useState } from 'react';
import type { Category } from '../../types/Category';
import { fetchCategories } from '../api/category';

type UseCategoryResult = {
  categories: Category[] | null;
  loading: boolean;
  error: string | null;
};

export function useCategory(): UseCategoryResult {
  const [categories, setData] = useState<Category[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories()
      .then((res) => {
        setData(res.categories);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { categories, loading, error };
}
