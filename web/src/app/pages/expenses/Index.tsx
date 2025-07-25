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

import type { Expense } from '../../../../types/Expense';

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

import { useExpense } from '../../../hooks/useExpense';
import { CategoriesExpensesSelect } from "./categoriesExpensesSelect";
import { DataTablePagination } from "./DataTablePagination";

import { Show } from "./Show";
import { Edit } from "./Edit";
import { New } from "./New";

import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

import { apiUrl } from "@/lib/api";

export function getColumns({
  openDeleteDialog,
  openViewDialog,
  openEditDialog
}: {
  openDeleteDialog: (id: string) => void;
  openViewDialog: (expense: Expense) => void;
  openEditDialog: (expense: Expense) => void;
  expensesRefetch: () => void;
}): ColumnDef<Expense>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <div className="hidden sm:flex">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="hidden sm:flex">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
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
      cell: ({ getValue }) => <div className="capitalize">{String(getValue() || "—")}</div>
    },
    {
      id: "status_summary",
      header: "Status",
      accessorFn: (row) => row.status?.summary ?? "",
      cell: ({ getValue }) => <div className="capitalize">{String(getValue() || "—")}</div>
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
              <DropdownMenuItem onClick={() => openViewDialog(row.original)}>
                Exibir
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openEditDialog(row.original)}>
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openDeleteDialog(row.original.id)}>Excluir</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    }
  ]
}

type Props = {
  month: number;
  year: number;
};

function Expenses({ month, year }: Props) {
  const monthYear = `${String(month).padStart(2, "0")}${year}`;

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const { data, loading: expensesLoading, error: expensesError, refetch: expensesRefetch } = useExpense(monthYear);

  const [deletingExpenseId, setDeletingExpenseId] = React.useState<string | null>(null);

  const [isAlertOpen, setIsAlertOpen] = React.useState(false);

  const [selectedEditExpense, setSelectedEditExpense] = React.useState<Expense | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

  const [selectedViewExpense, setSelectedViewExpense] = React.useState<Expense | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false);

  function openViewDialog(expense: Expense) {
    setSelectedViewExpense(expense);
    setIsViewDialogOpen(true);
  }

  function openEditDialog(expense: Expense) {
    setSelectedEditExpense(expense);
    setIsEditDialogOpen(true);
  }

  function openDeleteDialog(id: string) {
    setDeletingExpenseId(id);
    setIsAlertOpen(true);
  }

  async function confirmDelete() {
    if (!deletingExpenseId) return;

    try {
      const response = await fetch(`${apiUrl}/v1/expenses/${deletingExpenseId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Despesa excluída com sucesso!");

        expensesRefetch();
      } else {
        toast.error("Ocorreu um erro ao excluir a despesa!");
      }
    } catch {
      toast.error("Ocorreu um erro ao excluir a despesa!");
    } finally {
      setIsAlertOpen(false);
      setDeletingExpenseId(null);
    }
  }

const columns = getColumns({
  openDeleteDialog: (id: string) => openDeleteDialog(id),
  openViewDialog: (expense: Expense) => openViewDialog(expense),
  openEditDialog: (expense: Expense) => openEditDialog(expense),
  expensesRefetch: expensesRefetch
});

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

  if (expensesLoading) return <p>Carregando...</p>;
  if (expensesError) return <p>Erro: {expensesError}</p>;

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

        < CategoriesExpensesSelect  table={table}  />
        
        <DropdownMenu >
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="hidden sm:inline-flex ml-auto mr-1">
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

        < New onExpenseCreated={expensesRefetch} />
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
            {(() => {
              const rows = table.getRowModel().rows;
              const minRows = 10;
              const emptyRows = Array.from({ length: Math.max(minRows - rows.length, 0) });

              return (
                <>
                  {rows.map((row) => (
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
                  ))}

                  {emptyRows.map((_, idx) => (
                    <TableRow key={`empty-${idx}`}>
                      {table.getVisibleLeafColumns().map((column) => (
                        <TableCell key={column.id} className="h-12">
                          {/* espaço vazio */}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </>
              );
            })()}
          </TableBody>
        </Table>
      </div>
      <div className="">
        < DataTablePagination table={table} />
      </div>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que deseja excluir esta despesa?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita, a despesa será removida permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsAlertOpen(false)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Show
        onExpenseCreated={() => {
          expensesRefetch();
          setIsViewDialogOpen(false);
        }}
        initialExpense={selectedViewExpense}
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
      />

      <Edit
        onExpenseEdited={() => {
          expensesRefetch();
          setIsEditDialogOpen(false);
        }}
        initialExpense={selectedEditExpense}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </section>
  )
}

export default Expenses