"use client"
 
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
 
import {
  type ChartConfig,
  ChartContainer,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
} from "@/components/ui/chart"
 
export const description = "A multiple bar chart"
 
const chartConfig = {
  incomes: {
    label: "incomes",
    color: "#8f8f8f",
  },
  expenses: {
    label: "expenses",
    color: "#000000",
  },
} satisfies ChartConfig
 
import { useIncomesExpensesTotalMonthsByYear } from "@/hooks/utils/dashboard/useIncomesExpensesTotalMonthsByYear"

// const chartData = [
//   { month: "January", receitas: 186, despesas: 80 },
//   { month: "February", receitas: 305, despesas: 200 },
//   { month: "March", receitas: 237, despesas: 120 },
//   { month: "April", receitas: 73, despesas: 190 },
//   { month: "May", receitas: 209, despesas: 130 },
//   { month: "June", receitas: 214, despesas: 140 }
// ]
 
export function Overview2() {
  // return (
  //   <></>
  // );
 
    const { data: chartData, loading, error } = useIncomesExpensesTotalMonthsByYear("2025");

    console.log("chartData", chartData);
 
    if (loading) return <p>Carregando...</p>;
    if (error) return <p>Erro: {error}</p>;
 
    console.log("chartData", chartData);
 
  return (
    <ResponsiveContainer width="100%" height={450}>
    <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[450px]">
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
  )
}
 
 