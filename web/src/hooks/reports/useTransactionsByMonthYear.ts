import { useEffect, useRef, useState } from "react";
import type { Transaction } from "../../../types/reports/Transaction";
import { fetchByMonthYear } from "../../api/reports/transactions/fetchByMonthYear";

type UseTransactionsResult = {
  data: Transaction[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

const BACKGROUND_REFRESH_MS = 1000 * 60; // 1 minuto

function isSameTransactions(a: Transaction[], b: Transaction[]) {
  if (a.length !== b.length) return false;

  const sortById = (list: Transaction[]) =>
    [...list].sort((x, y) => x.id - y.id);

  const aSorted = sortById(a);
  const bSorted = sortById(b);

  for (let i = 0; i < aSorted.length; i++) {
    const ta = aSorted[i];
    const tb = bSorted[i];

    if (
      ta.id !== tb.id ||
      ta.summary !== tb.summary ||
      ta.value !== tb.value ||
      ta.date !== tb.date ||
      ta.category.id !== tb.category.id ||
      ta.status.id !== tb.status.id
    ) {
      return false;
    }
  }

  return true;
}


export function useTransactionsByMonthYear(month_year: string): UseTransactionsResult {
  const [data, setData] = useState<Transaction[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dataRef = useRef<Transaction[] | null>(null);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const triggerRefetch = useRef<() => void>(() => {});

  async function fetchAndUpdate() {
    try {
      const res = await fetchByMonthYear(month_year);
      const newData = res.transactions;

      if (!dataRef.current || !isSameTransactions(dataRef.current, newData)) {
        setData(newData);
        dataRef.current = newData;
      }

      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Erro ao buscar transações");
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
