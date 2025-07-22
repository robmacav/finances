import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, SelectLabel } from "@/components/ui/select"
import { useCategory } from "@/hooks/useCategory"
import { useStatus } from "@/hooks/useStatus"
import React, { useEffect, useState } from "react"

import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon, Plus } from "lucide-react"

import { type Expense } from "../../../../types/Expense"

type NewProps = {
  onExpenseCreated: () => void;
  initialExpense?: Expense | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function formatDate(date: Date | undefined) {
  if (!date) return ""
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function isValidDate(date: Date | undefined) {
  if (!date) return false
  return !isNaN(date.getTime())
}

export function Show({ onExpenseCreated, initialExpense, open, onOpenChange }: NewProps) {
  const { data: categoryData = [] } = useCategory()
  const { data: statusData = [] } = useStatus()

  const [summary, setSummary] = useState("")
  const [valueInput, setValueInput] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>()
  const [selectedStatus, setSelectedStatus] = useState("2")
  const [details, setDetails] = useState("")
  const [date, setDate] = useState<Date | undefined>()
  const [month, setMonth] = useState<Date | undefined>(new Date())
  const [value, setValue] = useState("")

  const [calendarOpen, setCalendarOpen] = useState(false)

  // Atualiza campos ao receber nova `initialExpense`
  useEffect(() => {
    if (initialExpense) {
      setSummary(initialExpense.summary ?? "")
      setValueInput(initialExpense.value?.toString() ?? "")
      setSelectedCategory(initialExpense.category?.id?.toString())
      setSelectedStatus(initialExpense.status?.id?.toString() ?? "2")
      setDetails(initialExpense.details ?? "")
      const parsedDate = initialExpense.date?.full ? new Date(initialExpense.date.full) : new Date()
      setDate(parsedDate)
      setMonth(parsedDate)
      setValue(formatDate(parsedDate))
    } else {
      // limpa campos
      setSummary("")
      setValueInput("")
      setSelectedCategory(undefined)
      setSelectedStatus("2")
      setDetails("")
      const today = new Date()
      setDate(today)
      setMonth(today)
      setValue(formatDate(today))
    }
  }, [initialExpense])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          Cadastrar <Plus className="" />
        </Button>
      </DialogTrigger>
      <DialogContent className="md:min-w-3xl xl:min-w-6xl">
        <DialogHeader>
          <DialogTitle>{initialExpense ? "Visualizar Despesa" : "Cadastro de Despesas"}</DialogTitle>
          <DialogDescription>
            {initialExpense
              ? "Visualize os detalhes da despesa."
              : "Preencha os campos abaixo para cadastrar uma nova despesa."}
          </DialogDescription>
        </DialogHeader>
        <form>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label>Título</Label>
              <Input
                id="summary"
                name="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                readOnly={!!initialExpense}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="value">Valor</Label>
              <Input
                id="value"
                name="value"
                value={valueInput}
                onChange={(e) => setValueInput(e.target.value)}
                disabled={!!initialExpense}
              />
            </div>

            <div className="grid gap-3">
              <Label>Data</Label>
              <div className="relative flex gap-2">
                <Input
                  id="date"
                  name="date"
                  value={value}
                  placeholder="June 01, 2025"
                  className="bg-background pr-10"
                  onChange={(e) => {
                    const d = new Date(e.target.value)
                    setValue(e.target.value)
                    if (isValidDate(d)) {
                      setDate(d)
                      setMonth(d)
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault()
                      setCalendarOpen(true)
                    }
                  }}
                  disabled={!!initialExpense}
                />

              </div>
            </div>

            <div className="grid gap-3">
              <Label>Categoria</Label>
              <Select
                name="category_id"
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                disabled={!!initialExpense}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categorias</SelectLabel>
                    {(categoryData ?? []).map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.summary}
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
                value={selectedStatus}
                onValueChange={setSelectedStatus}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um status" />
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
            </div>

            <div className="grid gap-3">
              <Label>Descrição</Label>
              <Textarea
                id="details"
                name="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={10}
                disabled={!!initialExpense}
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            {!initialExpense && <Button type="submit">Salvar</Button>}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
