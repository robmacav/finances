import {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent,
  DropdownMenuLabel, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import type { Transaction } from "types/reports/Transaction";

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState
} from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox";

function getColumns({ openDeleteDialog, openViewDialog, openEditDialog }: any) {
  const columns: ColumnDef<Transaction>[] = [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
    {
      accessorKey: "summary",
      header: "Descrição",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("summary")}</div>
      ),
    },
    {
      accessorKey: "value",
      header: "Valor",
      accessorFn: (row: Transaction) => row.value?.formated ?? "—",
    },
    {
      id: "date",
      header: "Data",
      accessorFn: (row: Transaction) => row.date?.full ?? "—",
    },
    {
      id: "kind",
      accessorFn: (row: Transaction) => row.kind ?? "—",
      enableHiding: true
    },
    {
      id: "category",
      header: "Categoria",
      accessorFn: (row: Transaction) => row.category?.summary ?? "—",
    },
    {
      id: "status",
      header: "Status",
      accessorFn: (row: Transaction) => row.status?.summary ?? "—",
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuCheckboxItem onClick={() => openViewDialog(row.original)}>Exibir</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem onClick={() => openEditDialog(row.original)}>Editar</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem onClick={() => openDeleteDialog(row.original.id)}>Excluir</DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  ]

  return columns;
}

export default getColumns;