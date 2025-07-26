"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"

import {
  type ChartConfig,
  ChartContainer,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
} from "@/components/ui/chart"

import { useIncomesExpensesTotalMonthsByYear } from "@/hooks/utils/dashboard/useIncomesExpensesTotalMonthsByYear"
import { useExpense } from '../../../hooks/useExpense';

import { useMemo, useState } from "react"
import { startOfWeek, endOfWeek, isWithinInterval, parseISO } from "date-fns"
import ptBR from "date-fns/locale/pt-BR"

const chartConfig = {
  expenses: {
    label: "Despesas",
    color: "#000000"
  }
} satisfies ChartConfig

export function Overview2({ monthYear }: { monthYear: string }) {
  const [viewMode, setViewMode] = useState<"semanal" | "mensal" | "anual">("anual")

  const { data: annualData } = useIncomesExpensesTotalMonthsByYear("2025")
  const { data: weeklyExpenses } = useExpense(monthYear)

  const filteredWeeklyData = useMemo(() => {
    if (!weeklyExpenses) return []

    const start = startOfWeek(new Date(), { weekStartsOn: 1 }) // Segunda
    const end = endOfWeek(new Date(), { weekStartsOn: 1 }) // Domingo

    const grouped = weeklyExpenses.reduce((acc: any[], curr: any) => {
      const date = parseISO(curr.date)
      if (!isWithinInterval(date, { start, end })) return acc

      const day = date.toLocaleDateString("pt-BR", { weekday: "short", timeZone: "UTC" })
      const found = acc.find(item => item.day === day)

      if (found) {
        found.expenses += Number(curr.amount)
      } else {
        acc.push({
          day,
          expenses: Number(curr.amount),
        })
      }

      return acc
    }, [])

    return grouped.sort((a, b) =>
      ["seg.", "ter.", "qua.", "qui.", "sex.", "sáb.", "dom."].indexOf(a.day) -
      ["seg.", "ter.", "qua.", "qui.", "sex.", "sáb.", "dom."].indexOf(b.day)
    )
  }, [weeklyExpenses])

  const chartData = useMemo(() => {
    if (viewMode === "anual" || viewMode === "mensal") {
      return annualData ?? []
    }
    return filteredWeeklyData
  }, [viewMode, annualData, filteredWeeklyData])

  return (
    <Card>
      <CardHeader className="items-center pb-0 flex flex-row justify-between">
        <CardTitle>Overview</CardTitle>
        <div>
          <Select onValueChange={(val) => setViewMode(val as typeof viewMode)}>
            <SelectTrigger className="w-[120px] h-8 text-sm px-2">
              <SelectValue placeholder="Anual" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="semanal">Semanal</SelectItem>
                <SelectItem value="mensal">Mensal</SelectItem>
                <SelectItem value="anual">Anual</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pl-2 h-full">
        <ResponsiveContainer width="100%" height="100%">
          <ChartContainer config={chartConfig} className="mx-auto h-full">
            <BarChart data={chartData ?? []}>
              <CartesianGrid vertical={false} />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <XAxis
                dataKey={viewMode === "semanal" ? "day" : "month"}
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) =>
                  viewMode === "semanal" ? value : value.slice(0, 3)
                }
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="expenses"
                fill="var(--color-expenses)"
                radius={4}
              />
            </BarChart>
          </ChartContainer>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
