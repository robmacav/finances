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
    color: "#3B5D73"
  },
  expenses: {
    label: "Despesas",
    color: "#8B3A3A"
  }
} satisfies ChartConfig
 
type Props = {
  title: string;
  data: {
    month: string;
    incomes: number;
    exepeses: number;
  }
};

export default function AnnualCashFlowOverview({ data: chartData }: Props) {
  function formatTick(value: number) {
  if (value >= 1000) {
    return (value / 1000).toFixed(value % 1000 === 0 ? 0 : 1) + ' mil'
  }
  return value.toString()
}

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0 flex flex-row justify-between">
        <CardTitle>Fluxo Financeiro Anual</CardTitle>
      </CardHeader>
      <CardContent className="pl-2 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatTick}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
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
 
 