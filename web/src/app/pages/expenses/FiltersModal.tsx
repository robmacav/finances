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
import { Funnel } from "lucide-react"
import React from "react"

type NewProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

function FiltersModal({ open, onOpenChange }: NewProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="sm:me-1">
          <Funnel />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filtrar as Despesas</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para configurar a listagem de despesas.
          </DialogDescription>
        </DialogHeader>


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
