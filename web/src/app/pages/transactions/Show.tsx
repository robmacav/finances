import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"

import { type Transaction } from "../../../../types/reports/Transaction"

type NewProps = {
  onTransactionCreated: () => void;
  initialTransaction?: Transaction | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function formatToDDMMYYYY(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function Show({ initialTransaction, open, onOpenChange }: NewProps) {
  const [summary, setSummary] = useState("")
  const [value, setValue] = useState("")
  const [category, setSelectedCategory] = useState<string | undefined>()
  const [status, setSelectedStatus] = useState("2")
  const [details, setDetails] = useState("")
  const [date, setDate] = useState("")

  useEffect(() => {
    if (initialTransaction) {
      setSummary(initialTransaction.summary ?? "")
      setValue(initialTransaction.value?.toString() ?? "")
      setSelectedCategory(initialTransaction.category?.summary?.toString())
      // setSelectedStatus(initialTransaction.status?.summary?.toString())
      setDetails(initialTransaction.details ?? "")

      const parsedDate = initialTransaction.date?.full ? new Date(initialTransaction.date.full) : new Date();
      setDate(formatToDDMMYYYY(parsedDate));
    } else {
      setSummary("")
      setValue("")
      setSelectedCategory("")
      setSelectedStatus("")
      setDetails("")
      setDate("");
    }
  }, [initialTransaction])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:min-w-3xl xl:min-w-6xl">
        <DialogHeader>
          <DialogTitle>{summary}</DialogTitle>
          <DialogDescription>
            Visualize os detalhes da despesa.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 mt-5">
          <div className="flex items-start justify-between gap-4 border-b pb-3">
            <Label className="text-muted-foreground min-w-[100px]">Valor</Label>
            <span className="text-right font-medium break-words max-w-sm text-foreground">
              {value || <span className="italic text-muted-foreground">Não informado</span>}
            </span>
          </div>
          <div className="flex items-start justify-between gap-4 border-b pb-3">
            <Label className="text-muted-foreground min-w-[100px]">Data</Label>
            <span className="text-right font-medium break-words max-w-sm text-foreground">
              {date || <span className="italic text-muted-foreground">Não informado</span>}
            </span>
          </div>
          <div className="flex items-start justify-between gap-4 border-b pb-3">
            <Label className="text-muted-foreground min-w-[100px]">Categoria</Label>
            <span className="text-right font-medium break-words max-w-sm text-foreground">
              {category || <span className="italic text-muted-foreground">Não informado</span>}
            </span>
          </div>
          <div className="flex items-start justify-between gap-4 border-b pb-3">
            <Label className="text-muted-foreground min-w-[100px]">Status</Label>
            <span className="text-right font-medium break-words max-w-sm text-foreground">
              {status || <span className="italic text-muted-foreground">Não informado</span>}
            </span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <Label className="text-muted-foreground min-w-[100px]">Descrição</Label>
            <span className="text-right font-medium break-words max-w-sm text-foreground">
              {details || <span className="italic text-muted-foreground">Não informado</span>}
            </span>
          </div>
        </div>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button className="px-10">Voltar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
