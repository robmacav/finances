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
import React from "react"

import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon, Plus } from "lucide-react"

import { toast } from "sonner"

import { apiUrl } from "@/lib/api";

type NewProps = {
  onIncomeCreated: () => void;
};

function formatDate(date: Date | undefined) {
  if (!date) return ""

  return date.toLocaleDateString("pt-BR")
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}

function formatDDMMYYYYToDDMMYYYYWithoutSlashes(dateStr: string | null): string {
  if (!dateStr) return "";

  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = dateStr.match(regex);
  if (!match) return "";

  const day = match[1];
  const month = match[2];
  const year = match[3];

  return `${day}${month}${year}`;
}


export function New({ onIncomeCreated }: NewProps) {
  const { data, loading, error } = useCategory();

  const [selectedCategory, setSelectedCategory] = React.useState<string | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = React.useState("2")

  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [month, setMonth] = React.useState<Date | undefined>(new Date());
  const [value, setValue] = React.useState(formatDate(date));

  return (
    <Dialog
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setSelectedCategory(undefined);
          setSelectedStatus("2");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          Cadastrar <Plus className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="md:min-w-3xl xl:min-w-6xl">
        <DialogHeader>
          <DialogTitle>Cadastro de Receitas</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para cadastrar uma nova receita.
          </DialogDescription>
        </DialogHeader>
        <form
        onSubmit={async (e) => {
          e.preventDefault()

          const form = e.currentTarget;
          const formData = new FormData(form);

          const payload = {
            summary: formData.get("summary"),
            value: parseFloat(formData.get("value")?.toString() || "0"),
            date: formatDDMMYYYYToDDMMYYYYWithoutSlashes(formData.get("date")?.toString() || ""),
            category_id: formData.get("category_id"),
            details: formData.get("details"),
            status_id: formData.get("status_id"),
            user_id: "2",
          };

            try {
              const response = await fetch(`${apiUrl}/incomes`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
              })

              if (response.ok) {
                toast.success("Receita cadastrada com sucesso!");

                onIncomeCreated();

                form.reset()
              } else {
                let errorMessage = ""
                const contentType = response.headers.get("Content-Type")

                if (contentType?.includes("application/json")) {
                  const errorData = await response.json()
                  errorMessage = JSON.stringify(errorData)
                } else {
                  errorMessage = await response.text()
                }

                toast.error("Falha ao cadastrar receita");
              }
            } catch (err) {
              toast.error("Falha ao cadastrar receita");
            }
          }}
        >
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label>Título</Label>
              <Input id="summary" name="summary" />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="value">Valor</Label>
              <Input id="value" name="value" autoComplete="off" />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="date">Data</Label>
              <div className="relative flex gap-2">
                <Input
                  id="date"
                  value={value}
                  name="date"
                  onClick={() => setOpen(true)}
                  onChange={(e) => {
                    const inputDate = new Date(e.target.value);
                    setValue(e.target.value);
                    if (isValidDate(inputDate)) {
                      setDate(inputDate);
                      setMonth(inputDate);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setOpen(true);
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
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      captionLayout="dropdown"
                      month={month}
                      onMonthChange={setMonth}
                      onSelect={(date) => {
                        setDate(date);
                        setValue(formatDate(date));
                        setOpen(false);
                      }}
                      locale={ptBR}
                    />

                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid gap-3">
              <Label>Categoria</Label>
              <Select
                name="category_id"
                value={selectedCategory ?? ""}
                onValueChange={(value) => setSelectedCategory(String(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={
                    loading ? "Carregando categorias..." : (error ? "Erro ao carregar categorias" : "Selecione uma categoria")
                  } />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categorias</SelectLabel>

                    {loading && (
                      <SelectItem disabled value="loading">Carregando...</SelectItem>
                    )}

                    {error && (
                      <SelectItem disabled value="error">Erro ao carregar</SelectItem>
                    )}

                    {!loading && !error && data?.map((category) => (
                      <SelectItem key={category.id} value={String(category.id)}>
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
                value={selectedStatus ?? ""}
                onValueChange={(value) => setSelectedStatus(String(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    <SelectItem key="2" value="2">Pendente</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-3">
              <Label>Descrição</Label>
              <Textarea id="details" name="details" rows={10} autoComplete="off" />
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
  );
}
