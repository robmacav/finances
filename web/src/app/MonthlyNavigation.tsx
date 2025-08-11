
import { Button } from "@/components/ui/button"

import { ChevronRight, ChevronLeft } from "lucide-react"

type Props = {
  changeMonth: (delta: number) => void;
};

export function MonthlyNavigation({ changeMonth }: Props) {
  return (
    <div className="flex items-center gap-1">
      <Button variant="outline" onClick={() => changeMonth(-1)}>
        <ChevronLeft />
      </Button>
      <Button variant="outline" onClick={() => changeMonth(1)}>
        <ChevronRight />
      </Button>
    </div>
  );
}
