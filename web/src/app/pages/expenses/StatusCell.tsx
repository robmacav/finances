// components/StatusCell.tsx
import React from "react";
import { toast } from "sonner";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select";
import { useStatus } from "@/hooks/useStatus";

type Props = {
  expenseId: string;
  statusId: string;
  expensesRefetch: () => void;
};

export function StatusCell({ expenseId, statusId, expensesRefetch }: Props) {
  const [selectedStatus, setSelectedStatus] = React.useState(statusId ?? "");
  const { data: statusData = [] } = useStatus();

  React.useEffect(() => {
    setSelectedStatus(statusId);
  }, [statusId]);

  const handleStatusChange = async (newStatusId: string) => {
    setSelectedStatus(newStatusId);

    try {
      await fetch(`http://localhost:3000/v1/expenses/${expenseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status_id: newStatusId }),
      });

      toast.success("Status atualizado com sucesso!");
      expensesRefetch(); // Aqui está a função correta
    } catch (error) {
      toast.error("Erro ao atualizar status.");
    }
  };

  return (
    <Select value={selectedStatus} onValueChange={handleStatusChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Selecione o status" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Status</SelectLabel>
          {statusData.map((status) => (
            <SelectItem key={status.id} value={status.id.toString()}>
              {status.summary}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
