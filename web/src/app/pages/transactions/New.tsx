import React, { useEffect, useState } from "react"

import { ptBR } from "date-fns/locale";
import { CalendarIcon, Plus, Trash } from "lucide-react"

import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"

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

import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue, 
  SelectLabel 
} from "@/components/ui/select"

import { useCategory } from "@/hooks/useCategory"
import { useStatus } from "@/hooks/useStatus"
import { useFormData } from "@/hooks/utils/transactions/useFormData"

import { createTransaction, createMultipleTransactions } from "@/api/transaction";

export function formatToDate(dateString: string): Date | null {
  const parts = dateString.split("/");

  if (parts.length !== 3) {
    console.warn("Formato inválido");
    return null;
  }

  const [dayStr, monthStr, yearStr] = parts;

  const day = parseInt(dayStr, 10);
  const month = parseInt(monthStr, 10) - 1; 
  const year = parseInt(yearStr, 10);

  if (
    isNaN(day) || isNaN(month) || isNaN(year) ||
    day < 1 || day > 31 || month < 0 || month > 11 || year < 1000
  ) {
    console.warn("Valores inválidos");
    return null;
  }

  const date = new Date(year, month, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    console.warn("Data inválida");
    return null;
  }

  return date;
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

function formatDayAndMonthYearToDate(day: string, monthYear: string) {
  const dayStr = String(day).padStart(2, "0");

  const month = monthYear.slice(0, 2);
  const year = monthYear.slice(2);

  return `${year}-${month}-${dayStr}`;
}

type Transaction = {
  summary: string;
  value: string;
  date: string;
  kind: string;
  category_id?: string;
};

type TransactionFormProps = {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  setSelectedKindLoteForm: any;
  selectedKindLoteForm: any;
  setMonthYearFieldLoteForm: any;
  monthYearFieldLoteForm: any;
};

function TransactionForm({ transactions, setTransactions, setSelectedKindLoteForm, selectedKindLoteForm, setMonthYearFieldLoteForm, monthYearFieldLoteForm }: TransactionFormProps) {
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

  return (
    <div className="space-y-4 overflow-y-auto p-2">
      <div className="flex gap-4">
        <div className="w-1/2">
          <div className="grid gap-3">
            <Label>Tipo de Transação</Label>
            <Select name="kind" value={selectedKindLoteForm} onValueChange={setSelectedKindLoteForm}>
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
        </div>
        <div className="w-1/2">
          <MonthYearPickerOnly value={monthYearFieldLoteForm} setValue={setMonthYearFieldLoteForm} />
        </div>
      </div>
      {transactions.map((transaction, index) => (
        <div key={index} className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-1 items-end">
          <Input
            type="hidden"
            id={`kind-${index}`}
            name={`kind-${index}`}
            value={transaction.kind}
          />

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

  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return ""

  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = String(date.getFullYear())

  return `${day}${month}${year}`
}

function formatDayMonthYear(day: number | string, monthYear: string): string {
  const dayStr = String(day).padStart(2, "0");
  const month = monthYear.slice(0, 2);  // "08"
  const year = monthYear.slice(2);      // "2025"

  return `${year}-${dayStr}-${month}`;
}


export function New({ onTransactionCreated }: NewProps) {
  const { data: statusData } = useStatus();

  const { data: formData } = useFormData();

  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  const [selectedKind, setSelectedKind] = useState("expense");
  const [selectedStatus, setSelectedStatus] = useState("1");

  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [month, setMonth] = React.useState<Date | undefined>(date)
  const [value, setValue] = React.useState(formatDate(date))

  const [monthYearField, setMonthYearField] = useState<string | undefined>(undefined);
  const [monthYearFieldLoteForm, setMonthYearFieldLoteForm] = useState(formatMonthYear(new Date()))

  const [selectedKindLoteForm, setSelectedKindLoteForm] = useState("expense");

  const [transactions, setTransactions] = useState<Transaction[]>([
    { summary: "", value: "", date: "", category_id: undefined, kind: selectedKindLoteForm }
  ]);

  const [tab, setTab] = useState("unico");

  return (
    <Dialog
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setSelectedCategory(undefined);
          setSelectedKind("expense");
          setSelectedStatus("2");
          setTab("unico");
          setTransactions([{ summary: "", value: "", date: "", category_id: undefined, kind: selectedKind }]);
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
                setTransactions([...transactions, { summary: "", value: "", date: "", kind: selectedKindLoteForm }])
              }
            >
              <Plus className="mr-2" />
              Adicionar transação
            </Button>
          )}
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
                date: formatToDate(formData.get("date")?.toString() || ""),
                category_id: formData.get("category_id"),
                details: formData.get("details"),
                kind: formData.get("kind"),
                status_id: formData.get("status_id"),
                user_id: "2"
              };

              if (
                !formData.get("summary") ||
                !formData.get("value") ||
                !formData.get("date") ||
                !formData.get("category_id") ||
                !formData.get("kind") ||
                !formData.get("status_id")
              ) {
                toast.error(`Preencha todos os campos do formulário!`);

                return;
              }

              try {
                const response = await createTransaction(payload);

                if (response.ok) {
                  await response.json();
                  
                  form.reset();

                  toast.success("Transação cadastrada com sucesso!");

                  onTransactionCreated();
                } else {
                  const contentType = response.headers.get("Content-Type");
                  let errorMessage = "";

                  if (contentType?.includes("application/json")) {
                    const errorData = await response.json();
                    errorMessage = JSON.stringify(errorData);
                  } else {
                    errorMessage = await response.text();
                  }

                  toast.error("Ocorreu um erro ao cadastrar a transação");
                }
              } catch (err) {
                toast.error("Ocorreu um erro ao cadastrar transação.");

                console.log("Ocorreu um erro ao cadastrar a transação: ", err);
              }
            }}
          >
              <div className="grid gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="basis-1/3 grid gap-3">
                    <Label>Tipo de Transação</Label>
                    <Select name="kind" value={selectedKind} onValueChange={setSelectedKind}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o tipo de transação" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Tipos de Transação</SelectLabel>
                          {formData?.kind.map((kind) => (
                            <SelectItem key={kind.value} value={kind.value.toString()}>
                              {kind.summary}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
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
                          {formData?.categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.summary}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                <div className="flex-1 grid gap-3">
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
                        {formData?.statuses.map((status) => (
                          <SelectItem key={status.id} value={status.id.toString()}>
                            {status.summary}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                </div>

                <div className="grid gap-3">
                  <Label >Descrição</Label>
                  <Textarea id="details" name="details" defaultValue="" rows={10} autoComplete="off" />
                </div>
              </div>
            </form>
          </TabsContent>
          <TabsContent value="lote" className="flex-1 overflow-y-auto">
            <form
              id="lote"
              onSubmit={async (e) => {
                e.preventDefault();

                const monthYearCleaned = monthYearFieldLoteForm.replace("/", "");
                
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
                  date: formatDayAndMonthYearToDate(exp.date, monthYearCleaned),
                  category_id: exp.category_id ?? null,
                  kind: selectedKindLoteForm,
                  status_id: "2",
                  user_id: "2"
                }));
                
                try {
                  const response = await createMultipleTransactions(formattedTransactions);

                  if (response.ok) {
                    await response.json();

                    setTransactions([]);

                    toast.success("Transações cadastradas com sucesso!");

                    onTransactionCreated();
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

            <TransactionForm 
              transactions={transactions} 
              setTransactions={setTransactions} 
              setSelectedKindLoteForm={setSelectedKindLoteForm} 
              selectedKindLoteForm={selectedKindLoteForm} 
              setMonthYearFieldLoteForm={setMonthYearFieldLoteForm}
              monthYearFieldLoteForm={monthYearFieldLoteForm} 
            />
          </form>

          </TabsContent>
        </Tabs>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button type="submit" form={tab === "unico" ? "unico" : "lote"}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
