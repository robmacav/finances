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
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const chartData = [
  { browser: "chrome", visitors: 275, fill: "#8884d8" },
  { browser: "safari", visitors: 200, fill: "#82ca9d" },
  { browser: "firefox", visitors: 187, fill: "#ffc658" },
  { browser: "edge", visitors: 173, fill: "#ff8042" },
  { browser: "other", visitors: 90, fill: "#d0ed57" }
];


const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "#8884d8",
  },
  safari: {
    label: "Safari",
    color: "#82ca9d",
  },
  firefox: {
    label: "Firefox",
    color: "#ffc658",
  },
  edge: {
    label: "Edge",
    color: "#ff8042",
  },
  other: {
    label: "Other",
    color: "#d0ed57",
  }
} satisfies ChartConfig

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
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Despesas" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="apple">Despesas</SelectItem>
                <SelectItem value="banana">Receitas</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
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
