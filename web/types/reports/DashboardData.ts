export type DashboardData = {
  summary: {
    incomes: string;
    expenses: string;
    available: string;
  };
  expenses_by_category: {
    category: {
      summary: string;
      color: string;
    };
    total: number;
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
