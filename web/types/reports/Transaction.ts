export type Transaction = {
  id: number;
  summary: string;
  details: string | null;

  value: {
    formated: string;
    original: string;
  }
  
  kind: 'expenses' | 'incomes';

  date: {
    full: string;
    day: number;
    month: number;
    year: number;
  } | null;

  status: {
    id: number | null;
    summary: string | null;
  };

  category: {
    id: number | null;
    summary: string | null;
    color: string | null;
  };

  subcategory: {
    id: number | null;
    summary: string | null;
  };
};
