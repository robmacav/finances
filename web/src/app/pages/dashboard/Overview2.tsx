"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card"
 
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
 
import {
  type ChartConfig,
  ChartContainer,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
} from "@/components/ui/chart"

const chartConfig = {
  incomes: {
    label: "Receitas",
    color: "#8f8f8f"
  },
  expenses: {
    label: "Despesas",
    color: "#000000"
  }
} satisfies ChartConfig
 
import { useIncomesExpensesTotalMonthsByYear } from "@/hooks/utils/dashboard/useIncomesExpensesTotalMonthsByYear"

type Props = {
  title: string;
};
 
export function Overview2({ title }: Props) {
  const { data: chartData } = useIncomesExpensesTotalMonthsByYear("2025");

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0 flex flex-row justify-between">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="pl-2 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ChartContainer config={chartConfig} className="mx-auto h-full">
            <BarChart accessibilityLayer data={chartData ?? []}>
              <CartesianGrid vertical={false} />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="incomes" fill="var(--color-incomes)" radius={4} />
              <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
            </BarChart>
          </ChartContainer>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
 
 