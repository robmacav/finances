export type DashboardData = {
  summary: {
    incomes: {
      value: string;
      insight: string;
    }
    expenses: {
      value: string;
      insight: string;
    }
    available: {
      value: string;
      insight: string;
    }
  };
  expenses_by_category: {
    category: {
      summary: string;
      color: string;
    };
    total: number;
    items: [];
  }[];
  total_by_months: {
    month: string; 
    incomes: number;
    expenses: number;
  }[];
  most_frequents: {
    summary: string;
    qtd: number;
    total: number;
  }[];
  current_week: {
    day: string;
    total: number;
  }[];
};
