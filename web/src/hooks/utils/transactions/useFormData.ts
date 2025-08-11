import { useEffect, useState } from "react";
import { formDataFetch } from "@/api/utils/transactions/formDataFetch";
import type { FormDataResponse } from "@/api/utils/transactions/formDataFetch";

export function useFormData() {
  const [data, setData] = useState<FormDataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await formDataFetch();
        setData(result);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, loading, error };
}
