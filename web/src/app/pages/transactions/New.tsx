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

import { ptBR } from "date-fns/locale";


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

import { createTransaction, createMultipleTransactions } from "@/api/transaction";

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

function formatDateDDMMYYYY(date: Date | undefined): string {
  if (!date) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Janeiro = 0
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}


type MonthYearPickerOnlyProps = {
  value: string;
  setValue: (value: string) => void;
};

export function MonthYearPickerOnly({ value, setValue }: MonthYearPickerOnlyProps) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date())

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
                  const formatted = formatMonthYear(newDate)
                  setValue(formatted)
                  setOpen(false)
                }}
                captionLayout="dropdown"
                fromYear={2020}
                toYear={2030}
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


type Transaction = {
  summary: string;
  value: string;
  date: string;
  category_id?: string;
};

type TransactionFormProps = {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
};

function TransactionForm({ transactions, setTransactions }: TransactionFormProps) {
  const handleChange = (index: number, field: keyof Transaction, value: string) => {
    const updated = [...transactions];
    updated[index][field] = value;
    setTransactions(updated);
  };

  const handleRemove = (index: number) => {
    const updated = transactions.filter((_, i) => i !== index);
    setTransactions(updated);
  };

  const { data: categoryData } = useCategory();

  const [monthYearField, setMonthYearField] = useState(formatMonthYear(new Date()))

  return (
    <div className="space-y-4 overflow-y-auto p-2">
      <MonthYearPickerOnly value={monthYearField} setValue={setMonthYearField} />
      {transactions.map((transaction, index) => (
        <div key={index} className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-1 items-end">
          <div className="grid gap-3">
            <Input
              id={`summary-${index}`}
              name={`summary-${index}`}
              value={transaction.summary}
              onChange={(e) => handleChange(index, "summary", e.target.value)}
              placeholder="Descrição"
            />
          </div>
          <div className="grid gap-3">
            <Input
              id={`value-${index}`}
              name={`value-${index}`}
              value={transaction.value}
              onChange={(e) => handleChange(index, "value", e.target.value)}
              placeholder="Valor"
            />
          </div>
          <div className="grid gap-3">
            <Input
              id={`date-${index}`}
              name={`date-${index}`}
              value={transaction.date}
              onChange={(e) => handleChange(index, "date", e.target.value)}
              placeholder="Dia"
            />
          </div>
          <div className="grid gap-3">
            <Select
              name="category_id"
              value={transaction.category_id ?? ""}
              onValueChange={(value) => handleChange(index, "category_id", value)}
            >
              <SelectTrigger className="min-w-[250px]">
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
  onTransactionCreated: () => void;
};

function formatDate(date: Date | undefined) {
  if (!date) return ""

  return date.toLocaleDateString("pt-BR")
}


function formatToDDMMYYYY(dateStr: string | null): string {
  if (!dateStr) return ""

  console.log("dataaaa", dateStr);

  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return ""

  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0") // Janeiro = 0
  const year = String(date.getFullYear())

  return `${day}${month}${year}`
}

function formatDayMonthYear(day: number | string, monthYear: string): string {
  const dayStr = String(day).padStart(2, "0");
  
  return dayStr + monthYear;
}


export function New({ onTransactionCreated }: NewProps) {
  const { data: categoryData } = useCategory();
  const { data: statusData } = useStatus();

  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedKind, setSelectedKind] = useState("transactions");
  const [selectedStatus, setSelectedStatus] = useState("2");

  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [month, setMonth] = React.useState<Date | undefined>(date)
  const [value, setValue] = React.useState(formatDate(date))

  const [monthYearField, setMonthYearField] = useState("07/2025");

  const [transactions, setTransactions] = useState<Transaction[]>([
    { summary: "", value: "", date: "", category_id: undefined }
  ]);

  const [tab, setTab] = useState("unico");

  return (
    <Dialog
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setSelectedCategory(undefined);
          setSelectedStatus("2");
          setTab("unico");
          setTransactions([{ summary: "", value: "", date: "", category_id: undefined }]);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          <span className="hidden sm:inline">Cadastrar</span><Plus className="" />
        </Button>
      </DialogTrigger>
      <DialogContent className="md:min-w-3xl xl:min-w-6xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Cadastro de Transações</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para cadastrar uma nova transação.
          </DialogDescription>
        </DialogHeader>
        <Tabs value={tab} onValueChange={setTab} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between my-5 gap-4">
            <TabsList>
                <TabsTrigger value="unico">Único</TabsTrigger>
                <TabsTrigger value="lote">Lote</TabsTrigger>
            </TabsList>
          {tab === "lote" && (
            <Button
              variant="outline"
              onClick={() =>
                setTransactions([...transactions, { summary: "", value: "", date: "" }])
              }
            >
              <Plus className="mr-2" />
              Adicionar transação
            </Button>
          )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 p-2">
            <div className="basis-1/3 grid gap-3">
              <Label>Tipo de Transação</Label>
              <Select name="kind" value={selectedKind} onValueChange={setSelectedKind}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    <SelectItem value="expenses">Despesas</SelectItem>
                    <SelectItem value="incomes">Receitas</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="unico" className="flex-1 overflow-y-auto p-2">
          <form
            id="unico"
            onSubmit={async (e) => {
              e.preventDefault();

              const form = e.currentTarget;
              const formData = new FormData(form);

              const payload = {
                summary: formData.get("summary")?.toString() || "",
                value: parseFloat(formData.get("value")?.toString() || "0"),
                date: formatToDDMMYYYY(formData.get("date")?.toString() || ""),
                category_id: formData.get("category_id"),
                details: formData.get("details"),
                kind: formData.get("kind"),
                status_id: formData.get("status_id"),
                user_id: "2"
              };

              try {
                const response = await createTransaction(payload);

                if (response.ok) {
                  toast.success("Transação cadastrada com sucesso!");
                  onTransactionCreated();
                  form.reset();
                } else {
                  const contentType = response.headers.get("Content-Type");
                  let errorMessage = "";

                  if (contentType?.includes("application/json")) {
                    const errorData = await response.json();
                    errorMessage = JSON.stringify(errorData);
                  } else {
                    errorMessage = await response.text();
                  }

                  toast.error("Erro ao cadastrar: " + errorMessage);
                }
              } catch (err) {
                toast.error("Erro ao cadastrar transação.");
              }
            }}
          >
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label>Título</Label>
                  <Input id="summary" name="summary" defaultValue="" placeholder="PVH Shopping" />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 grid gap-3">
                    <Label htmlFor="value">Valor</Label>
                    <Input id="value" name="value" defaultValue="" autoComplete="off" placeholder="R$ 128.79" />
                  </div>
                  <div className="flex-1 grid gap-3">
                    <Label htmlFor="name-1">Data</Label>
                    <div className="flex flex-col gap-3">
                      <div className="relative flex gap-2">
                      <Input
                        id="date"
                        value={value}
                        name="date"
                        placeholder="June 01, 2025"
                        className="bg-background pr-10"
                        onFocus={() => setOpen(true)}
                        onChange={(e) => {
                          const date = new Date(e.target.value);
                          setValue(e.target.value);
                          if (isValidDate(date)) {
                            setDate(date);
                            setMonth(date);
                            setValue(formatDateDDMMYYYY(date));
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
                              setDate(date);
                              setValue(formatDateDDMMYYYY(date));
                              setOpen(false);
                            }}
                            locale={ptBR}
                          />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 grid gap-3">
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
                </div>
                <div className="grid gap-3">
                  <Label>Status</Label>
                  <Select
                    name="status_id"
                    value={selectedStatus ?? ""}
                    onValueChange={(value) => setSelectedStatus(String(value))}
                  >
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
                  <Textarea id="details" name="details" defaultValue="" rows={5} autoComplete="off" />
                </div>
              </div>
            </form>
          </TabsContent>
          <TabsContent value="lote" className="flex-1 overflow-y-auto">
            <form
              onSubmit={async (e) => {
                e.preventDefault();

                const monthYearCleaned = monthYearField.replace("/", "");

                const hasInvalid = transactions.some((exp, index) => {
                  if (
                    !exp.summary?.trim() ||
                    !exp.value?.toString().trim() ||
                    !exp.date?.trim() ||
                    !exp.category_id
                  ) {
                    toast.error(`Preencha todos os campos da linha ${index + 1}`);
                    return true;
                  }
                  return false;
                });

                if (hasInvalid) return;

                const formattedTransactions = transactions.map((exp) => ({
                  summary: exp.summary,
                  value: parseFloat(exp.value || "0"),
                  date: formatDayMonthYear(exp.date, monthYearCleaned),
                  category_id: exp.category_id ?? null,
                  status_id: "2",
                  user_id: "2"
                }));

                try {
                  const response = await createMultipleTransactions(formattedTransactions);

                  if (response.ok) {
                    toast.success("Transações cadastradas com sucesso!");
                    setTransactions([]);
                  } else {
                    let errorMessage = "";
                    const contentType = response.headers.get("Content-Type");

                    if (contentType?.includes("application/json")) {
                      const errorData = await response.json();
                      errorMessage = JSON.stringify(errorData);
                    } else {
                      errorMessage = await response.text();
                    }

                    toast.error("Falha ao cadastrar transações!");
                  }
                } catch (err) {
                  toast.error("Falha ao cadastrar transações!");
                }
              }}
            >

            <TransactionForm transactions={transactions} setTransactions={setTransactions} />
            <div className="mt-6 flex justify-end">
              <Button type="submit">Salvar Todas</Button>
            </div>
          </form>

          </TabsContent>
        </Tabs>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button type="submit" form={tab === "unico" ? "unico" : undefined}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
