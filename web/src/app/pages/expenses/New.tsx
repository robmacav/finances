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
import React, { useState } from "react"

import { Calendar } from "@/components/ui/calendar"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon, Plus, Trash } from "lucide-react"

import { toast } from "sonner"
import { useStatus } from "@/hooks/useStatus"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { apiUrl } from "@/lib/api";

function isValidDate(date: Date | undefined) {
  if (!date) return false
  return !isNaN(date.getTime())
}

function formatMonthYear(date: Date | undefined): string {
  if (!date) return ""
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  return `${month}/${year}`
}

export function MonthYearPickerOnly() {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [value, setValue] = useState(formatMonthYear(date))

  return (
    <div className="grid gap-3">
      <Label htmlFor="month-year">Mês e Ano</Label>
      <div className="flex flex-col gap-3">
        <div className="relative flex gap-2">
          <Input
            id="month-year"
            name="month_year"
            value={value}
            placeholder="07/2025"
            className="bg-background pr-10"
            readOnly
          />
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
              >
                <CalendarIcon className="size-3.5" />
                <span className="sr-only">Selecionar mês e ano</span>
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
                onMonthChange={(newDate) => {
                  setDate(newDate)
                  setValue(formatMonthYear(newDate))
                  setOpen(false)
                }}
                captionLayout="dropdown"
                fromYear={2020}
                toYear={2030}
                // ⚠️ Bloqueia seleção de dias
                modifiers={{ disabled: () => true }}
                showOutsideDays={false}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}

type Expense = {
  summary: string;
  value: string;
  date: string;
  category_id?: string;
};

type ExpenseFormProps = {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
};

function ExpenseForm({ expenses, setExpenses }: ExpenseFormProps) {
  const handleChange = (index: number, field: keyof Expense, value: string) => {
    const updated = [...expenses];
    updated[index][field] = value;
    setExpenses(updated);
  };

  const handleRemove = (index: number) => {
    const updated = expenses.filter((_, i) => i !== index);
    setExpenses(updated);
  };

  const { data: categoryData } = useCategory();


  return (
    <div className="space-y-6 overflow-y-auto p-2">
      < MonthYearPickerOnly />
      {expenses.map((expense, index) => (
        <div key={index} className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-end">
          <div className="grid gap-3">
            <Label htmlFor={`summary-${index}`}>Descrição</Label>
            <Input
              id={`summary-${index}`}
              name={`summary-${index}`}
              value={expense.summary}
              onChange={(e) => handleChange(index, "summary", e.target.value)}
              placeholder="Amazon"
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor={`value-${index}`}>Valor</Label>
            <Input
              id={`value-${index}`}
              name={`value-${index}`}
              value={expense.value}
              onChange={(e) => handleChange(index, "value", e.target.value)}
              placeholder="85.75"
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor={`date-${index}`}>Dia</Label>
            <Input
              id={`date-${index}`}
              name={`date-${index}`}
              value={expense.date}
              onChange={(e) => handleChange(index, "date", e.target.value)}
              placeholder="07"
            />
          </div>
          <div className="grid gap-3">
            <Label>Categoria</Label>
            <Select
              name="category_id"
              value={expense.category_id ?? ""}
              onValueChange={(value) => handleChange(index, "category_id", value)}
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
          <Button
            type="button"
            variant="outline"
            className="text-red-500"
            onClick={() => handleRemove(index)}
          >
            < Trash />
          </Button>
        </div>
      ))}
    </div>
  );
}

type NewProps = {
  onExpenseCreated: () => void;
};

function formatDate(date: Date | undefined) {
  if (!date) {
    return ""
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function formatToDDMMYYYY(dateStr: string | null): string {
  if (!dateStr) return ""

  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return ""

  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0") // Janeiro = 0
  const year = String(date.getFullYear())

  return `${day}${month}${year}`
}

export function New({ onExpenseCreated }: NewProps) {
  const { data: categoryData } = useCategory();
  const { data: statusData } = useStatus();

  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined)

  const [selectedStatus, setSelectedStatus] = useState("2")

  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(
    new Date("2025-07-14")
  )
  const [month, setMonth] = React.useState<Date | undefined>(date)
  const [value, setValue] = React.useState(formatDate(date))

  const [expenses, setExpenses] = useState<Expense[]>([
    { summary: "", value: "", date: "", category_id: undefined }
  ]);

  const [tab, setTab] = useState("expenses");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <span className="hidden sm:inline">Cadastrar</span><Plus className="" />
        </Button>
      </DialogTrigger>
      <DialogContent className="md:min-w-3xl xl:min-w-6xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Cadastro de Despesas</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para cadastrar uma nova despesa.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="expenses" value={tab} onValueChange={setTab} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between my-5 gap-4">
            <TabsList>
                <TabsTrigger value="unico">Único</TabsTrigger>
                <TabsTrigger value="lote">Lote</TabsTrigger>
            </TabsList>
          {tab === "lote" && (
            <Button
              variant="outline"
              onClick={() =>
                setExpenses([...expenses, { summary: "", value: "", date: "" }])
              }
            >
              <Plus className="mr-2" />
              Adicionar despesa
            </Button>
          )}
          
          </div>
          <TabsContent value="unico" className="flex-1 overflow-y-auto p-2">
            <form
              onSubmit={async (e) => {
                e.preventDefault()

                const form = e.currentTarget;
                const formData = new FormData(form);

                const payload = {
                  summary: formData.get("summary"),
                  value: parseFloat(formData.get("value")?.toString() || "0"),
                  date: formatToDDMMYYYY(formData.get("date")?.toString() || ""),
                  category_id: formData.get("category_id"),
                  details: formData.get("details"),
                  status_id: formData.get("status_id"),
                  user_id: "2"
                }

                try {
                  const response = await fetch(`${apiUrl}/v1/expenses`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                  })

                  if (response.ok) {
                    toast.success("Despesa cadastrada com sucesso!");

                    onExpenseCreated();

                    form.reset()
                  } else {
                    const contentType = response.headers.get("Content-Type")

                    if (contentType?.includes("application/json")) {
                      const errorData = await response.json()
                      errorMessage = JSON.stringify(errorData)
                    } else {
                      errorMessage = await response.text()
                    }

                    toast.error("Falha ao cadastrar despesa");
                  }
                } catch (err) {
                  toast.error("Falha ao cadastrar despesa");
                  console.error("Erro ao enviar dados:", err)
                } 
              }}
            >
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label>Título</Label>
                  <Input id="summary" name="summary" defaultValue="" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="value">Valor</Label>
                  <Input id="value" name="value" defaultValue="" />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="name-1">Data</Label>
                      <div className="flex flex-col gap-3">
                        <div className="relative flex gap-2">
                          <Input
                            id="date"
                            value={value}
                            name="date"
                            placeholder="June 01, 2025"
                            className="bg-background pr-10"
                            onChange={(e) => {
                              const date = new Date(e.target.value)
                              setValue(e.target.value)
                              if (isValidDate(date)) {
                                setDate(date)
                                setMonth(date)
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "ArrowDown") {
                                e.preventDefault()
                                setOpen(true)
                              }
                            }}
                          />
                          <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                id="date-picker"
                                variant="ghost"
                                className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                              >
                                <CalendarIcon className="size-3.5" />
                                <span className="sr-only">Select date</span>
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
                                onSelect={(date) => {
                                  setDate(date)
                                  setValue(formatDate(date))
                                  setOpen(false)
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                </div>
                <div className="grid gap-3">
                  <Label>Categoria</Label>
                  <Select name="category_id" value={selectedCategory} onValueChange={setSelectedCategory}>
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
                  <Select name="status_id" value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Status</SelectLabel>
                        {(statusData ?? []).map((status) => (
                          <SelectItem key={status.id} value={status.id.toString()}>
                            {status.summary}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                  <Label >Descrição</Label>
                  <Textarea id="details" name="details" defaultValue="" rows={5}  />
                </div>
              </div>
            </form>
          </TabsContent>
          <TabsContent value="lote" className="flex-1 overflow-y-auto">
            <ExpenseForm expenses={expenses} setExpenses={setExpenses} />
          </TabsContent>
        </Tabs>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button type="submit">Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
