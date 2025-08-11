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
import { CalendarIcon, Funnel } from "lucide-react"

import { useFormData } from "@/hooks/utils/transactions/useFormData"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

type FilterValues = {
  kind: string;
  category: string;
  status: string;
  date: string;
};

type NewProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onApplyFilter?: (filters: FilterValues) => void;
  onClearFilters?: () => void;
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
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Janeiro = 0
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function FilterDialog({ open, onOpenChange, onApplyFilter, onClearFilters }: NewProps) {
  const { data: formData } = useFormData();

  const [selectedKind, setSelectedKind] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [openC, setOpenC] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [month, setMonth] = useState<Date | undefined>(undefined)
  const [value, setValue] = useState("")

  function handleClearFilters() {
    setSelectedKind("");
    setSelectedCategory("");
    setSelectedStatus("");
    setDate(undefined);
    onOpenChange?.(true);

    if (onClearFilters) onClearFilters();
  }

  function handleApplyFilter() {
    if (onApplyFilter) {
      onApplyFilter({
        kind: selectedKind,
        category: selectedCategory,
        status: selectedStatus,
        date: formatDate(date)
      });
    }
    onOpenChange?.(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="sm:me-1 me-1 sm:me-0">
          <Funnel />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader className="mb-5">
          <DialogTitle>Filtrar as Despesas</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para configurar a listagem de despesas.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="grid gap-3 w-full">
            <Label>Tipo de Transação</Label>
            <Select name="kind" value={selectedKind} onValueChange={setSelectedKind}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma categoria" />
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
          <Label>Categoria</Label>
            <Select
              name="category"
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categorias</SelectLabel>
                  {formData?.categories.slice().sort((a, b) => a.summary.localeCompare(b.summary)).map((category) => (
                    <SelectItem key={category.id} value={category.summary.toString()}>
                      {category.summary}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
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
                  e.preventDefault()
                  setOpenC(true)
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
          <Label>Status</Label>
          <Select name="status" value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                {formData?.statuses.map((status) => (
                  <SelectItem key={status.id} value={status.summary.toString()}>
                    {status.summary}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="outline" onClick={handleClearFilters}>Limpar</Button>
          </DialogClose>
          <Button type="button" onClick={handleApplyFilter}>Filtrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default FilterDialog
