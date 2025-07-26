"use client"

import { Label } from "@/components/ui/label"
import { Pie, PieChart, ResponsiveContainer } from "recharts"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useAllByMonthYearByCategories } from "@/hooks/reports/expenses/useAllByMonthYearByCategories"

type Props = {
  month: number;
  year: number;
};

function PieChart1({ month, year }: Props) {
  const monthYear = `${String(month).padStart(2, "0")}${year}`;

  const { data: rawData, loading, error } = useAllByMonthYearByCategories(monthYear);

  const chartData = rawData?.map((item) => ({
    category: item.category.summary,
    total: item.total,
    fill: `#${item.category.color.replace(/^#/, '')}`
  }));

  const chartConfig = rawData?.reduce((acc: any, item: any) => {
    const key = item.category.summary;
    acc[key] = {
      label: key,
      color: `#${item.category.color.replace(/^#/, '')}`
    };
    return acc;
  }, {} as Record<string, { label: string; color: string }>);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;

function dados() {
  return (
    <div className="w-full sm:max-h-[300px] sm:overflow-y-auto">
      <ul className="w-full p-5">
        {chartData.map(
          (
            item: { category: string; total: number; fill: string },
            index: number
          ) => (
            <li
              key={index}
              className="border-b last:border-b-0 pb-3 mt-5"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center min-w-[100px]">
                  <span
                    className="inline-block w-4 h-4 rounded-full mr-2 flex-shrink-0"
                    style={{ backgroundColor: item.fill }}
                    aria-hidden="true"
                  ></span>
                  <Label className="text-muted-foreground whitespace-nowrap">
                    {item.category}
                  </Label>
                </div>
                <span className="text-right font-medium break-words max-w-sm text-foreground">
                  R$ {item.total}
                </span>
              </div>
            </li>
          )
        )}
      </ul>
    </div>
  );
}



  return (
    <Card className="col-span-6">
      <CardHeader className="items-center pb-0 flex flex-row justify-between">
        <CardTitle>Categorias</CardTitle>
        <div className="">
          <Select>
            <SelectTrigger className="w-[120px] h-8 text-sm px-2">
              <SelectValue placeholder="Despesas" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="apple">Despesas</SelectItem>
                <SelectItem value="banana">Receitas</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ResponsiveContainer width="100%" height={450}>
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[450px]"
          >
            <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie data={chartData} dataKey="total" nameKey="category" />
            </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter>
        {dados()}
      </CardFooter>
    </Card>
  )
}

export default PieChart1
