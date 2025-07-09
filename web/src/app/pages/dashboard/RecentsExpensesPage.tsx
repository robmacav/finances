import { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../.../../../../components/ui/avatar"

import { useExpense } from '../../../hooks/useExpense';

export function RecentExpensesPage() {
    const [monthYear, setMonthYear] = useState(() => {
        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = String(today.getFullYear());
        return `${month}${year}`;
    });

  const { data, loading: expensesLoading, error: expensesError } = useExpense(monthYear);

  if (!data) return <p>Sem dados</p>;

  return (
    <div className="space-y-4">
      {data?.slice(0, 5).map((expense, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="" alt="Avatar" />
            <AvatarFallback></AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{expense.summary}</p>
            <p className="text-sm text-muted-foreground">{expense.category.summary}</p>
          </div>
          <div className="ml-auto font-medium">{expense.value}</div>
        </div>
      ))}
    </div>
  );
}
