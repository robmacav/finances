import { useEffect, useState, useRef } from "react";
import type { Expense } from "../../types/Expense";
import { fetchExpenses } from "../api/expense";

type UseExpenseResult = {
  data: Expense[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

type CacheEntry = {
  timestamp: number;
  data: Expense[];
};

const CACHE_KEY = "expense_cache";
const CACHE_TTL_MS = 1000 * 60 * 120; // 2 horas
const BACKGROUND_REFRESH_MS = 1000 * 60; // 30 segundos

function loadCache(): Record<string, CacheEntry> {
  if (typeof window === "undefined") return {};

  try {
    const cacheString = localStorage.getItem(CACHE_KEY);
    if (!cacheString || cacheString.trim() === "") return {};
    return JSON.parse(cacheString || "");
  } catch (error) {
    console.warn("Erro ao carregar cache do localStorage:", error);
    return {};
  }
}


function saveCache(cache: Record<string, CacheEntry>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Falha ao salvar cache pode ser ignorada
  }
}

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

        const cacheUpdated = loadCache();
        cacheUpdated[month_year] = {
          timestamp: Date.now(),
          data: newData,
        };
        saveCache(cacheUpdated);
      }
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Erro ao buscar despesas");
      setLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;
    const cache = loadCache();
    const cacheEntry = cache[month_year];
    const now = Date.now();

    if (cacheEntry && now - cacheEntry.timestamp < CACHE_TTL_MS) {
      setData(cacheEntry.data);
      dataRef.current = cacheEntry.data;
      setLoading(false);
    } else {
      setLoading(true);
    }
    setError(null);

    triggerRefetch.current = () => {
      if (isMounted) fetchAndUpdate();
    };

    if (!cacheEntry || now - cacheEntry.timestamp >= CACHE_TTL_MS) {
      fetchAndUpdate();
    }

    // Função para iniciar intervalo
    function startInterval() {
      if (intervalIdRef.current) return; // já iniciado
      intervalIdRef.current = setInterval(() => {
        if (!document.hidden) {
          fetchAndUpdate();
        }
      }, BACKGROUND_REFRESH_MS);
    }

    // Função para limpar intervalo
    function stopInterval() {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    }

    // Evento para escutar visibilidade da aba
    function handleVisibilityChange() {
      if (document.hidden) {
        stopInterval();
      } else {
        fetchAndUpdate(); // busca imediata ao voltar
        startInterval();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Inicia o intervalo se a aba já estiver visível
    if (!document.hidden) {
      startInterval();
    }

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
