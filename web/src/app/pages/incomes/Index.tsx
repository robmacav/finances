"use client"

import * as React from "react"

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

import type { Income } from '../../../../types/Income';

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

import { useIncome } from '../../../hooks/useIncome';
import { CategoriesExpensesSelect } from "@/app/pages/expenses/categoriesExpensesSelect";
import { DataTablePagination } from "@/app/pages/expenses/DataTablePagination";
import { New } from "./New";

export const columns: ColumnDef<Income>[] = [
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
    id: "subcategory_summary",
    header: "Sub-categoria",
    accessorFn: (row) => row.subcategory?.summary ?? "",
    cell: ({ getValue }) => <div className="capitalize">{String(getValue() || "—")}</div>,
  },
  {
    id: "status_summary",
    header: "Status",
    accessorFn: (row) => row.status?.summary ?? "",
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

type Props = {
  month: number;
  year: number;
};

function Incomes({ month, year }: Props) {
  const monthYear = `${String(month).padStart(2, "0")}${year}`;

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const { data, loading: incomesLoading, error: incomesError } = useIncome(monthYear);

const memoizedData = React.useMemo(() => data ?? [], [data]);

  const table = useReactTable({
    data: memoizedData,
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

  if (incomesLoading) return <p>Carregando...</p>;
  if (incomesError) return <p>Erro: {incomesError}</p>;

  const TableColumnLabels: Record<string, string> = {
    summary: "Descrição",
    value: "Valor",
    date_full: "Data",
    category_summary: "Categoria",
    subcategory_summary: "Sub-categoria",
    status_summary: "Status"
  };

  return (
    <section className="mt-5">
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
        < New  />
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
      <div className="">
        < DataTablePagination table={table} />
      </div>
    </section>
  )
}

export default Incomes