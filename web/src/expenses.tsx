"use client"

import * as React from "react"
import { useState } from "react";

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
  type VisibilityState,
} from "@tanstack/react-table"
import { ChevronDown, MoreHorizontal } from "lucide-react"

import type { Expense } from './../types/Expense';

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useExpense } from '../src/hooks/useExpense';
import { CategoriesExpensesSelect } from "./categoriesExpensesSelect";
import { DateExpensesSelect } from "./DateExpensesSelect";

export const columns: ColumnDef<Expense>[] = [
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
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("value")}</div>
    ),
  },
  {
    id: "date_full",
    header: "Data",
    accessorFn: (row) => row.date?.full ?? "",
    cell: ({ getValue }) => <div className="capitalize">{String(getValue() || "—")}</div>,
  },
  {
    id: "category_summary",
    header: "Categoria",
    accessorFn: (row) => row.category?.summary ?? "",
    cell: ({ getValue }) => <div className="capitalize">{String(getValue() || "—")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acões</DropdownMenuLabel>
            <DropdownMenuItem>Exibir</DropdownMenuItem>
            <DropdownMenuItem>Excluir</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

function Expenses() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const [monthYear, setMonthYear] = useState(() => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = String(today.getFullYear());
    return `${month}${year}`;
  });
  
  const changeMonth = (delta: number) => {
    const month = parseInt(monthYear.slice(0, 2));
    const year = parseInt(monthYear.slice(2));
    
    const newDate = new Date(year, month - 1 + delta);
    const newMonth = String(newDate.getMonth() + 1).padStart(2, '0');
  const newYear = String(newDate.getFullYear());
  
  setMonthYear(`${newMonth}${newYear}`);
};

console.log(monthYear);

const { data, loading: expensesLoading, error: expensesError } = useExpense(monthYear);

console.log("data expenses.tsx: ", {monthYear}, {data});

  const table = useReactTable({
    data,
    columns,
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection
  })

  if (expensesLoading) return <p>Carregando...</p>;
  if (expensesError) return <p>Erro: {expensesError}</p>;

  const TableColumnLabels: Record<string, string> = {
    summary: "Descrição",
    value: "Valor",
    date_full: "Data",
    category_summary: "Categoria"
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar despesa..."
          value={(table.getColumn("summary")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("summary")?.setFilterValue(event.target.value)
          }
          className="max-w-sm mr-3"
        />
        < CategoriesExpensesSelect table={table} />
        < DateExpensesSelect monthYear={monthYear} changeMonth={changeMonth} />
        <DropdownMenu >
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto mr-3">
              Colunas <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {TableColumnLabels[column.id] ?? column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        <Select
          value={table.getState().pagination.pageSize.toString()}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="">
            <SelectValue placeholder="Registros por página" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {[10, 15, 20, 25, 50, 100].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="cursor-pointer select-none"
                  >
                    {header.isPlaceholder ? null : (
                      <div className="flex items-center gap-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: "↑",
                          desc: "↓"
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} linha(s) selecionadas.
        </div>
        <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior 
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Próxima
        </Button>
        </div>
      </div>
    </div>
  )
}

export default Expenses