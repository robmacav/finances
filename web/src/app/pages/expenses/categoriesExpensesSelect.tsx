import { useCategory } from "../../../hooks/useCategory";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

import type { Table } from "@tanstack/react-table";

type CategoriesExpensesSelectProps<TData> = {
  table: Table<TData>;
};

export function CategoriesExpensesSelect<TData>({
  table,
}: CategoriesExpensesSelectProps<TData>) {
  const { data: categories, loading, error } = useCategory();

  const handleCategoryChange = (value: string) => {
    const filterValue = value === "all" ? undefined : value;
    table.getColumn("category_summary")?.setFilterValue(filterValue);
  };

  const renderCategories = () =>
    categories?.map((category) => (
      <SelectItem key={category.summary} value={category.summary.toString()}>
        {category.summary}
      </SelectItem>
    ));

  return (
    <div className="hidden sm:block">
      <Select onValueChange={handleCategoryChange}>
        <SelectTrigger className="min-w-[250px] mr-3">
          <SelectValue placeholder="Categorias" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {!loading && !error && renderCategories()}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
