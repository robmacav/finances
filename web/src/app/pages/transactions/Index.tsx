"use client"

import * as React from "react"

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
  Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"

import { flexRender } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import getColumns from './getColumns';
import DeleteDialog from './dialogs/DeleteDialog'

import { useTransactionsByMonthYear } from '../../../hooks/reports/useTransactionsByMonthYear';
import { DataTablePagination } from "./DataTablePagination";

import { ShowDialog } from "./dialogs/ShowDialog";
import { EditDialog } from "./dialogs/EditDialog";
import { NewDialog } from "./dialogs/NewDialog";
import FilterDialog from "./dialogs/FilterDialog";
import type { Transaction } from "types/reports/Transaction";
import { Button } from "@/components/ui/button"
import { Plus, SquarePen } from "lucide-react"
import EditMultiplesDialog from "./dialogs/EditMultiplesDialog"
import DeleteMultiplesDialog from "./dialogs/DeleteMultiplesDialog"

function Index({ month, year }: any) {
  const monthYear = `${String(month).padStart(2, "0")}${year}`;

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = React.useState({})
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })

  const { data, loading, error, refetch } = useTransactionsByMonthYear(monthYear);
  const tableData = React.useMemo(() => data ?? [], [data]);

  const [transactionView, setTransactionView] = React.useState<Transaction | null>(null);
  const [transactionEdit, setTransactionEdit] = React.useState<Transaction | null>(null);
  const [transactionDeleteId, setTransactionDeleteId] = React.useState<string | null>(null);

  const [isEditMultiplesDialogOpen, setIsEditMultiplesDialogOpen] = React.useState(false);
  const [isDeleteMultiplesDialogOpen, setIsDeleteMultiplesDialogOpen] = React.useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = React.useState(false);

  const [transactionIDsEditMultiples, setTransactionIDsEditMultiples] = React.useState<number[] | null>(null);
  const [transactionIDsDeleteMultiples, setTransactionIDsDeleteMultiples] = React.useState<number[] | null>(null);

  const columns = React.useMemo(() => getColumns({
    openDeleteDialog: (id: string) => { setTransactionDeleteId(id); setIsDeleteDialogOpen(true); },
    openEditDialog: (transaction: Transaction) => { setTransactionEdit(transaction); setIsEditDialogOpen(true); },
    openViewDialog: (transaction: Transaction) => { setTransactionView(transaction); setIsViewDialogOpen(true); },
  }), []);

  const [columnVisibility, setColumnVisibility] = React.useState({
    kind: false
  });

  const table = useReactTable({
    data: tableData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    }
  });

  React.useEffect(() => {
    const selectedIds = table
      .getSelectedRowModel()
      .rows
      .map(row => row.original.id)

    setTransactionIDsEditMultiples(selectedIds);
    setTransactionIDsDeleteMultiples(selectedIds);
  }, [rowSelection, table])

  function handleApplyFilter(filters: { kind: string, category: string, status: string, date: string }) {
    const newFilters = [];

    if (filters.kind) {
      newFilters.push({ id: "kind", value: filters.kind });
    }

    if (filters.category) {
      newFilters.push({ id: "category", value: filters.category });
    }

    if (filters.status) {
      newFilters.push({ id: "status", value: filters.status });
    }

    if (filters.date) {
      newFilters.push({ id: "date", value: filters.date });
    }

    setColumnFilters(newFilters);
  }

  const total = table.getRowModel().rows.reduce((acc, row) => {
    const valueRaw = row.original.value.original || 0;
    const value = typeof valueRaw === "string" ? parseFloat(valueRaw) : valueRaw;
    return acc + (isNaN(value) ? 0 : value);
  }, 0);

  const totalRounded = Math.round(total * 100) / 100;

  const totalFormatted = totalRounded.toFixed(2);

  function handleClearFilters() {
    setColumnFilters([]);
  }

  const hasSelection = table.getSelectedRowModel().rows.length > 0;

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
          <FilterDialog 
            open={isFilterDialogOpen} 
            onOpenChange={setIsFilterDialogOpen} 
            onApplyFilter={handleApplyFilter}
            onClearFilters={handleClearFilters}
          />
        </div>
          <div>
            {hasSelection ? (
              <div className="flex gap-1">
                <EditMultiplesDialog 
                  open={isEditMultiplesDialogOpen} 
                  onOpenChange={setIsEditMultiplesDialogOpen} 
                  transactionIDs={transactionIDsEditMultiples}
                  onTransactionsUpdated={refetch}
                  setRowSelection={setRowSelection}
                />
                <DeleteMultiplesDialog 
                  transactionIDs={transactionIDsDeleteMultiples}
                  onTransactionsDeleted={refetch}
                  setRowSelection={setRowSelection}
                />
              </div>
            ) : (
              <NewDialog onTransactionCreated={refetch} />
            )}
          </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
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
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell colSpan={5}>R$ {totalFormatted}</TableCell>
          </TableRow>
        </TableFooter>
        </Table>
      </div>

      <DataTablePagination table={table} />

      < DeleteDialog 
        isDeleteDialogOpen={isDeleteDialogOpen} 
        setIsDeleteDialogOpen={setIsDeleteDialogOpen} 
        id={transactionDeleteId} 
        refetch={refetch} 
      />

      <ShowDialog
        onTransactionCreated={() => { refetch(); setIsViewDialogOpen(false); }}
        transaction={transactionView}
        isViewDialogOpen={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
      />

      <EditDialog
        onTransactionEdited={() => { refetch(); setIsEditDialogOpen(false); }}
        initialTransaction={transactionEdit}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </section>
  );
}

export default Index;
