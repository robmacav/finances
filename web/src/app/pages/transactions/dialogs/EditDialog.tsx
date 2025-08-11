import { useEffect, useState } from "react"
import { CalendarIcon } from "lucide-react"
import { toast } from "sonner"

import {
  Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectLabel,
  SelectTrigger, SelectValue
} from "@/components/ui/select"
import {
  Popover, PopoverContent, PopoverTrigger
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

import { useFormData } from "@/hooks/utils/transactions/useFormData"
import { type Transaction } from "../../../../../types/reports/Transaction"
import { editTransaction } from "@/api/transaction"

type NewProps = {
  onTransactionEdited: () => void;
  initialTransaction?: Transaction | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

function isValidDate(date: Date | undefined): boolean {
  return date instanceof Date && !isNaN(date.getTime())
}

function formatDateToISO(dateStr: string): string {
  const [day, month, year] = dateStr.split("/")
  if (!day || !month || !year) return ""
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
}

export function EditDialog({ onTransactionEdited, initialTransaction, open, onOpenChange }: NewProps) {
  const { data: formData } = useFormData()

  const [summary, setSummary] = useState("")
  const [value, setValue] = useState("")
  const [category, setSelectedCategory] = useState<string | undefined>()
  const [kind, setSelectedKind] = useState<string | undefined>()
  const [status, setSelectedStatus] = useState<string | undefined>()
  const [details, setDetails] = useState("")
  const [date, setDate] = useState<Date | undefined>()
  const [dateInput, setDateInput] = useState("")
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [month, setMonth] = useState<Date | undefined>(date)

  useEffect(() => {
    if (initialTransaction) {
      setSummary(initialTransaction.summary ?? "")
      setValue(initialTransaction.value.original.toString() ?? "")
      setSelectedCategory(initialTransaction.category?.id?.toString() ?? "")
      setSelectedKind(initialTransaction.kind?.toString() ?? "")
      setSelectedStatus(initialTransaction.status?.id?.toString() ?? "")
      setDetails(initialTransaction.details ?? "")
      setDateInput(initialTransaction.date?.full?.toString() ?? "")
    } else {
      setSummary("")
      setValue("")
      setSelectedCategory("")
      setSelectedKind("")
      setSelectedStatus("")
      setDetails("")
      setDate(undefined)
      setDateInput("")
    }
  }, [initialTransaction])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild />
      <DialogContent className="md:min-w-3xl xl:min-w-6xl">
        <DialogHeader>
          <DialogTitle>{initialTransaction?.summary}</DialogTitle>
          <DialogDescription>
            Faça a alteração dos campos abaixo para atualizar os dados da transação.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={async (e) => {
            e.preventDefault()

            const form = e.currentTarget
            const formData = new FormData(form)

            const payload = {
              id: initialTransaction?.id || "",
              kind: formData.get("kind"),
              summary: formData.get("summary"),
              value: parseFloat(formData.get("value")?.toString() || "0"),
              date: formatDateToISO(formData.get("date")?.toString() || ""),
              category_id: formData.get("category_id"),
              details: formData.get("details"),
              status_id: formData.get("status_id"),
              user_id: "2"
            }

            try {
              const response = await editTransaction(payload)

              if (response.ok) {
                await response.json()
                toast.success("Transação atualizada com sucesso!")
                onTransactionEdited()
              } else {
                const contentType = response.headers.get("Content-Type")
                const errorMessage = contentType?.includes("application/json")
                  ? JSON.stringify(await response.json())
                  : await response.text()

                toast.error("Ocorreu um erro ao atualizar transação")
              }
            } catch (err) {
              toast.error("Ocorreu um erro ao atualizar transação")
              console.error("Erro:", err)
            }
          }}
        >
          <div className="grid gap-4 mt-5">
            <div className="grid gap-3">
              <Label>Tipo de Transação</Label>
              <Select name="kind" value={kind} onValueChange={setSelectedKind}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    <SelectItem value="expense">Despesas</SelectItem>
                    <SelectItem value="income">Receitas</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-3">
              <Label>Título</Label>
              <Input id="summary" name="summary" defaultValue={summary} />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="value">Valor</Label>
              <Input id="value" name="value" defaultValue={value} />
            </div>

            <div className="grid gap-3">
              <Label>Data</Label>
              <div className="relative flex gap-2">
                <Input
                  id="date"
                  name="date"
                  value={dateInput}
                  placeholder="01/06/2025"
                  className="bg-background pr-10"
                  onChange={(e) => {
                    setDateInput(e.target.value)
                    const d = new Date(e.target.value)
                    if (isValidDate(d)) {
                      setDate(d)
                      setMonth(d)
                    }
                  }}
                  onKeyDown={(e) => e.key === "ArrowDown" && e.preventDefault()}
                />
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                    >
                      <CalendarIcon className="size-3.5" />
                      <span className="sr-only">Selecionar data</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="end"
                    alignOffset={-8}
                    sideOffset={10}
                  >
                    <Calendar
                      mode="single"
                      selected={date}
                      captionLayout="dropdown"
                      month={month}
                      onMonthChange={setMonth}
                      onSelect={(selectedDate) => {
                        if (selectedDate) {
                          setDate(selectedDate)
                          setDateInput(formatDate(selectedDate))
                          setCalendarOpen(false)
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid gap-3">
              <Label>Categoria</Label>
              <Select
                name="category_id"
                value={category}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categorias</SelectLabel>
                    {formData?.categories.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>
                        {c.summary}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-3">
              <Label>Status</Label>
              <Select
                name="status_id"
                value={status}
                onValueChange={setSelectedStatus}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    {formData?.statuses.map((s) => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.summary}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-3">
              <Label>Descrição</Label>
              <Textarea
                id="details"
                name="details"
                defaultValue={details}
                rows={10}
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
