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

import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue, 
  SelectLabel 
} from "@/components/ui/select"

import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"

import { Label } from "@/components/ui/label"
import { Funnel } from "lucide-react"

import { useCategory } from "@/hooks/useCategory"

type NewProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

function FiltersModal({ open, onOpenChange }: NewProps) {
  const { data: categoryData } = useCategory();

  const [selectedKind, setSelectedKind] = useState("expense");
  const [selectedCategory, setSelectedCategory] = useState("outros");
  const [selectedStatus, setSelectedStatus] = useState("pendete");

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
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="expense">Despesas</SelectItem>
                  <SelectItem value="income">Receitas</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-3 w-full">
          <Label>Categoria</Label>
            <Select
              name="category_id"
              value={selectedCategory}
              onValueChange={setSelectedCategory}
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

        <div className="grid gap-3 w-full">
          <Label>Status</Label>
          <Select name="category_id" value={selectedCategory} onValueChange={setSelectedCategory}>
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

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button type="submit">Filtrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default FiltersModal
