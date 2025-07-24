
import { Button } from "@/components/ui/button"

import { ChevronRight, ChevronLeft } from "lucide-react"

type Props = {
  month: number;
  year: number;
  changeMonth: (delta: number) => void;
};

export function DateExpensesSelect({ month, year, changeMonth }: Props) {
  return (
    <div className="flex items-center gap-1">
      <Button variant="outline" onClick={() => changeMonth(-1)}>
        <ChevronLeft />
      </Button>
      <Button variant="outline" className="hidden">
        {new Date(year, month - 1)
          .toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
          .replace(/^./, (str) => str.toUpperCase())}
      </Button>
      <Button variant="outline" onClick={() => changeMonth(1)}>
        <ChevronRight />
      </Button>
    </div>
  );
}
