export type Expense = {
  id: string;
  summary: string;
  details: string;
  value: string;
  
  date: {
    full: string;
    day: string;
    month: string;
    year: string;
  }

  category: {
    summary: string;
    color: string;
  }

  subcategory: {
    summary: string;
  }

  user: {
    first_name: string;
    last_name: string;
  }

  status: {
    id: any;
    summary: string;
  }
};
