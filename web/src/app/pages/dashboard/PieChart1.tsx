"use client"

import { TrendingUp } from "lucide-react"
import { Pie, PieChart, ResponsiveContainer } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { useAllByMonthYearByCategories } from "@/hooks/reports/expenses/useAllByMonthYearByCategories"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
    </Card>
  )
}

export default PieChart1
