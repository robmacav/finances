import { useCategory } from "../../../hooks/useCategory"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import type { Table } from "@tanstack/react-table";

type CategoriesExpensesSelectProps<TData> = {
  table: Table<TData>;
};

export function CategoriesExpensesSelect<TData>({
  table,
}: CategoriesExpensesSelectProps<TData>) {
  const { data } = useCategory();

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
            {data?.map((category) => (
              <SelectItem key={category.summary} value={category.summary.toString()}>
                {category.summary}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}