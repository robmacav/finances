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
import { CalendarIcon } from "lucide-react"

import { toast } from "sonner"
import { useStatus } from "@/hooks/useStatus"

import { type Transaction } from "../../../../types/reports/Transaction"

import { apiUrl } from "@/lib/api";

type NewProps = {
  onTransactionEdited: () => void;
  initialTransaction?: Transaction | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

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

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}

function formatDateToDDMMYYYY(dateStr: string): string {
  const date = new Date(dateStr);
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // meses são de 0 a 11
  const year = String(date.getFullYear());

  return `${day}${month}${year}`;
}

function formatDateToISO(dateStr: string): string {
  const date = new Date(dateStr);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // meses são base 0
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
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

export function Edit({ onTransactionEdited, initialTransaction, open, onOpenChange }: NewProps) {
  const { data: categoryData } = useCategory();
  const { data: statusData } = useStatus();

  const [calendarOpen, setCalendarOpen] = React.useState(false);


  const [selectedCategory, setSelectedCategory] = useState(
    initialTransaction?.category?.id?.toString()
  );

  const [selectedStatus, setSelectedStatus] = useState(
    initialTransaction?.status?.id?.toString()
  );

  const [value, setValue] = useState(formatDate(new Date(initialTransaction?.date?.full || "")));
  const [date, setDate] = useState(new Date(initialTransaction?.date?.full || ""));

  const [month, setMonth] = React.useState<Date | undefined>(date)

  const [selectedKind, setSelectedKind] = useState<string | undefined>(
    initialTransaction?.kind as string
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
      </DialogTrigger>
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

            const form = e.currentTarget;
            const formData = new FormData(form);

            const payload = {
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
              const response = await fetch(`${apiUrl}/transactions/${initialTransaction?.id}`, {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
              })

              if (response.ok) {
                toast.success("Transação atualizada com sucesso!");

                onTransactionEdited();

                form.reset()
              } else {
                const contentType = response.headers.get("Content-Type")
                let errorMessage = "";

                if (contentType?.includes("application/json")) {
                  const errorData = await response.json()
                  errorMessage = JSON.stringify(errorData)
                } else {
                  errorMessage = await response.text()
                }

                toast.error("Falha ao atualizar transação");
              }
            } catch (err) {
              toast.error("Falha ao atualizar transação");
              console.error("Erro ao enviar dados:", err)
            } 
          }}
        >
        <div className="grid gap-4 mt-5">
          <div className="grid gap-3">
            <Label>Tipo de Transação</Label>
            <Select name="kind" value={selectedKind} onValueChange={setSelectedKind}>
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
            <Input id="summary" name="summary" defaultValue={initialTransaction?.summary ?? ""} />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="value">Valor</Label>
            <Input id="value" name="value" defaultValue={initialTransaction?.value.original ?? ""} />
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
                    }
                  }}
                />
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
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
                        setValue(formatDate(date))
                        setCalendarOpen(false)
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
            <Textarea id="details" name="details" defaultValue="" rows={10}  />
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
