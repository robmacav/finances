
import { Button } from "@/components/ui/button"

import { ChevronRight, ChevronLeft } from "lucide-react"

type Props = {
  monthYear: string;
  changeMonth: (delta: number) => void;
};

export function DateExpensesSelect({ monthYear, changeMonth }: Props) {
  return (
    <div className="flex items-center gap-1">
      <Button variant="outline" onClick={() => changeMonth(-1)}>
        <ChevronLeft />
      </Button>
      <Button variant="outline">
        {new Date(parseInt(monthYear.slice(2)), parseInt(monthYear.slice(0, 2)) - 1)
          .toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
          .replace(/^./, (str) => str.toUpperCase())}
      </Button>
      <Button variant="outline" onClick={() => changeMonth(1)}>
        <ChevronRight />
      </Button>
    </div>
  );
}
