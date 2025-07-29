import { useCategory } from "../../../hooks/useCategory";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Skeleton } from "@/components/ui/skeleton"; // Supondo que você tenha um componente de Skeleton

import type { Table } from "@tanstack/react-table";

type CategoriesExpensesSelectProps<TData> = {
  table: Table<TData>;
};

export function CategoriesExpensesSelect<TData>({
  table,
}: CategoriesExpensesSelectProps<TData>) {
  const { data, loading, error } = useCategory(); 

  return (
    <div className="hidden sm:block">
      <Select
        onValueChange={(value) => {
          const filterValue = value === "all" ? undefined : value;
          table.getColumn("category_summary")?.setFilterValue(filterValue);
        }}
      >
        <SelectTrigger className="w-[180px] mr-3">
          <SelectValue placeholder="Categorias" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">Todas as categorias</SelectItem>

            {loading &&
              [...Array(3)].map((_, idx) => (
                <div key={idx} className="px-4 py-2">
                  <Skeleton className="h-4 w-[120px]" />
                </div>
              ))}

            {!loading && !error && data?.map((category) => (
              <SelectItem key={category.summary} value={category.summary.toString()}>
                {category.summary}
              </SelectItem>
            ))}

            {!loading && error && (
              <SelectItem disabled value="error">
                Erro ao carregar categorias
              </SelectItem>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
