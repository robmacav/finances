import { useEffect, useState, useRef } from "react";
import type { Expense } from "../../types/Expense";
import { fetchExpenses } from "../api/expense";

type UseExpenseResult = {
  data: Expense[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

const BACKGROUND_REFRESH_MS = 1000 * 60; // 1 minuto

function isSameExpenses(a: Expense[], b: Expense[]) {
  if (a.length !== b.length) return false;

  const aIds = new Set(a.map(e => e.id));
  const bIds = new Set(b.map(e => e.id));

  if (aIds.size !== bIds.size) return false;

  for (const id of aIds) {
    if (!bIds.has(id)) return false;
  }

  return true;
}

export function useExpense(month_year: string): UseExpenseResult {
  const [data, setData] = useState<Expense[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dataRef = useRef<Expense[] | null>(null);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const triggerRefetch = useRef<() => void>(() => {});

  async function fetchAndUpdate() {
    try {
      const res = await fetchExpenses(month_year);
      const newData = res.expenses;

      if (!dataRef.current || !isSameExpenses(dataRef.current, newData)) {
        setData(newData);
        dataRef.current = newData;
      }
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Erro ao buscar despesas");
      setLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    setLoading(true);
    setError(null);

    triggerRefetch.current = () => {
      if (isMounted) fetchAndUpdate();
    };

    fetchAndUpdate();

    function startInterval() {
      if (intervalIdRef.current) return;
      intervalIdRef.current = setInterval(() => {
        if (!document.hidden) {
          fetchAndUpdate();
        }
      }, BACKGROUND_REFRESH_MS);
    }

    function stopInterval() {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        stopInterval();
      } else {
        fetchAndUpdate();
        startInterval();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    if (!document.hidden) startInterval();

    return () => {
      isMounted = false;
      stopInterval();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [month_year]);

  return {
    data,
    loading,
    error,
    refetch: () => {
      triggerRefetch.current();
    }
  };
}
