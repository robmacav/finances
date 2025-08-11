"use client"

import { useState } from "react"

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

import { ptBR } from "date-fns/locale";

import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue, 
  SelectLabel 
} from "@/components/ui/select"

import { Label } from "@/components/ui/label"
import { CalendarIcon, Funnel, SquarePen } from "lucide-react"

import { useFormData } from "@/hooks/utils/transactions/useFormData"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { toast } from "sonner";

import { editMultipleTransactions } from "@/api/transaction";

import { type RowSelectionState } from "@tanstack/react-table";

type NewProps = {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    transactionIDs: [];
    onTransactionsUpdated: () => void;
    setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>;
};

function isValidDate(date: Date | undefined) {
  if (!date) return false
  return !isNaN(date.getTime())
}

function formatDate(date: Date | undefined) {
  if (!date) return ""

  return date.toLocaleDateString("pt-BR")
}

function formatDateDDMMYYYY(date: Date | undefined): string {
  if (!date) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); 
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

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

function EditMultiplesDialog({ open, onOpenChange, transactionIDs, onTransactionsUpdated, setRowSelection }: NewProps) {
  const { data: formData } = useFormData();

  const [selectedKind, setSelectedKind] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [openC, setOpenC] = useState(false)
  const [date, setDate] = useState(undefined)
  const [month, setMonth] = useState<Date | undefined>(date)
  const [value, setValue] = useState(formatDate(date))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
            variant="outline"
        >
        <SquarePen className="mr-1" />
            <span className="hidden sm:inline">Editar</span>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader className="mb-5">
          <DialogTitle>Editar as Transações</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para editar os dados das transações.
          </DialogDescription>
        </DialogHeader>
            <form
                id="editMultiplesTransactions"
                onSubmit={async (e) => {
                    e.preventDefault();

                    const form = e.currentTarget;
                    const formData = new FormData(form);

                    const payload = {
                        ids: transactionIDs,
                        data: {
                            summary: formData.get("summary"),
                            kind: selectedKind,
                            value: parseFloat(formData.get("value")?.toString() || "0"),
                            date: formatToDate(formData.get("date")?.toString() || ""),
                            category_id: selectedCategory,
                            status_id: selectedStatus,
                            user_id: "2"
                        }
                    };

                    try {
                        const response = await editMultipleTransactions(payload);

                        if (response.ok) {
                            await response.json();
                            
                            form.reset();

                            toast.success("Transação cadastrada com sucesso!");

                            setRowSelection({})

                            onTransactionsUpdated();
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
                <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="grid gap-3 w-full">
                    <Label>Tipo de Transação</Label>
                    <Select name="kind" value={selectedKind} onValueChange={setSelectedKind}>
                        <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Tipos de Transações</SelectLabel>
                            {formData?.kind.map((k) => (
                            <SelectItem key={k.value} value={k.value.toString()}>
                                {k.summary}
                            </SelectItem>
                            ))}
                        </SelectGroup>
                        </SelectContent>
                    </Select>
                    </div>
                </div>

                <div className="grid gap-3 w-full">
                    <Label>Título</Label>
                    <Input id="summary" name="summary" defaultValue="" placeholder="PVH Shopping" />
                </div>

                <div className="grid gap-3 w-full">
                    <Label>Valor</Label>
                    <Input id="value" name="value" defaultValue="" placeholder="R$ 125,87" />
                </div>

                <div className="grid gap-3 w-full">
                    <Label htmlFor="name-1">Data</Label>
                    <div className="flex flex-col gap-3">
                    <div className="relative flex gap-2">
                        <Input
                        id="date"
                        value={value}
                        name="date"
                        placeholder="June 01, 2025"
                        className="bg-background pr-10"
                        onFocus={() => setOpenC(true)}
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
                            e.preventDefault();
                            setOpenC(true);
                            }
                        }}
                        />

                        <Popover open={openC} onOpenChange={setOpenC}>
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
                                setOpenC(false);
                            }}
                            locale={ptBR}
                            />
                        </PopoverContent>
                        </Popover>
                    </div>
                    </div>
                </div>

                <div className="grid gap-3 w-full">
                    <Label>Categoria</Label>
                    <Select name="category" value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                        <SelectLabel>Categorias</SelectLabel>
                        {formData?.categories
                            .slice()
                            .sort((a, b) => a.summary.localeCompare(b.summary))
                            .map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                                {category.summary}
                            </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-3 w-full">
                    <Label>Status</Label>
                    <Select name="status" value={selectedStatus} onValueChange={setSelectedStatus}>
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
            </form>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button type="submit" form="editMultiplesTransactions" >Atualizar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditMultiplesDialog

{/* { ids: [596, 597, 598], data: { kind: "XXX", title: "XXX", value: 0.00, date: XX, category_id: XX, status_id: XX } } */}
