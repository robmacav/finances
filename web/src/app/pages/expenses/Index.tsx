"use client"

import * as React from "react"
import { apiUrl } from "@/lib/api";

import {
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"

import { flexRender } from "@tanstack/react-table"

import {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent,
  DropdownMenuLabel, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  AlertDialog, AlertDialogContent, AlertDialogHeader,
  AlertDialogTitle, AlertDialogDescription, AlertDialogFooter,
  AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog"

import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"

import type { Expense } from '../../../../types/Expense';
import { useExpense } from '../../../hooks/useExpense';
import { DataTablePagination } from "./DataTablePagination";

import { Show } from "./Show";
import { Edit } from "./Edit";
import { New } from "./New";
import FiltersModal from "./FiltersModal";

function getColumns({ openDeleteDialog, openViewDialog, openEditDialog }: any) {
  return [
    {
      accessorKey: "summary",
      header: "Descrição",
    },
    {
      accessorKey: "value",
      header: "Valor",
    },
    {
      id: "date_full",
      header: "Data",
      accessorFn: (row: Expense) => row.date?.full ?? "—",
    },
    {
      id: "category_summary",
      header: "Categoria",
      accessorFn: (row: Expense) => row.category?.summary ?? "—",
    },
    {
      id: "subcategory_summary",
      header: "Sub-categoria",
      accessorFn: (row: Expense) => row.subcategory?.summary ?? "—",
    },
    {
      id: "status_summary",
      header: "Status",
      accessorFn: (row: Expense) => row.status?.summary ?? "—",
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
}

type Props = {
  month: number;
  year: number;
};

function Expenses({ month, year }: Props) {
  const monthYear = `${String(month).padStart(2, "0")}${year}`;

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })

  const { data, loading, error, refetch } = useExpense(monthYear);
  const tableData = React.useMemo(() => data ?? [], [data]);

  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);

  const [editExpense, setEditExpense] = React.useState<Expense | null>(null);
  const [editOpen, setEditOpen] = React.useState(false);

  const [viewExpense, setViewExpense] = React.useState<Expense | null>(null);
  const [viewOpen, setViewOpen] = React.useState(false);

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`${apiUrl}/expenses/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Despesa excluída com sucesso!");
      refetch();
    } catch {
      toast.error("Erro ao excluir despesa!");
    } finally {
      setIsAlertOpen(false);
      setDeleteId(null);
    }
  }

  const columns = React.useMemo(() => getColumns({
    openDeleteDialog: (id: string) => { setDeleteId(id); setIsAlertOpen(true); },
    openEditDialog: (expense: Expense) => { setEditExpense(expense); setEditOpen(true); },
    openViewDialog: (expense: Expense) => { setViewExpense(expense); setViewOpen(true); },
  }), []);

  const table = useReactTable({
    data: tableData,
    columns,
    state: { sorting, columnFilters, columnVisibility, rowSelection, pagination },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <section className="mt-5">
      <div className="flex justify-between items-center py-4">
        <div className="flex w-full">
          <Input
            placeholder="Filtrar despesa..."
            value={(table.getColumn("summary")?.getFilterValue() as string) ?? ""}
            onChange={(e) => table.getColumn("summary")?.setFilterValue(e.target.value)}
            className="w-full sm:max-w-sm mr-1"
          />
          < FiltersModal />
        </div>
        <New onExpenseCreated={refetch} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        className="cursor-pointer"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {header.column.columnDef.header as string} {header.column.getIsSorted() ? (header.column.getIsSorted() === 'asc' ? '↑' : '↓') : null}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {loading || error ? (
              [...Array(10)].map((_, idx) => (
                <TableRow key={idx}>
                  {table.getVisibleLeafColumns().map(col => (
                    <TableCell key={col.id} className="h-12">
                      <div className="h-4 w-full bg-muted rounded animate-pulse" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length} className="text-center h-96 text-muted-foreground">
                  Sem registros.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que deseja excluir esta despesa?</AlertDialogTitle>
            <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <FiltersModal
        open={viewOpen}
        onOpenChange={setViewOpen}
      />


      <Show
        onExpenseCreated={() => { refetch(); setViewOpen(false); }}
        initialExpense={viewExpense}
        open={viewOpen}
        onOpenChange={setViewOpen}
      />

      <Edit
        onExpenseEdited={() => { refetch(); setEditOpen(false); }}
        initialExpense={editExpense}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </section>
  );
}

export default Expenses;
