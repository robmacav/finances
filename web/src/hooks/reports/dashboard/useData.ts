import { useEffect, useState } from "react";
import { fetchData } from "@/api/reports/dashboard/fetchData";
import { type DashboardData } from "../../../../types/reports/DashboardData";

export const useDashboardData = (monthYear: string) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    setLoading(true);
    setError(null);

    fetchData(monthYear)
      .then((res) => {
        if (isMounted) setData(res);
      })
      .catch((err) => {
        if (isMounted) setError(err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [monthYear]);

  return { data, loading, error };
};
