"use client"

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
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"

import { Label } from "@/components/ui/label"
import { Funnel } from "lucide-react"

type NewProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

function FiltersModal({ open, onOpenChange }: NewProps) {
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

        <Label>Status</Label>
        <RadioGroup defaultValue="comfortable" className="flex">
          <div className="flex items-center gap-3">
            <RadioGroupItem value="default" id="r1" />
            <Label htmlFor="r1">Concluído</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="comfortable" id="r2" />
            <Label htmlFor="r2">Pendente</Label>
          </div>
        </RadioGroup>

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
