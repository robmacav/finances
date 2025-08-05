"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import { useAllCurrentWeek } from "@/hooks/reports/expenses/useAllCurrentWeek"

import { type DashboardData } from "../../../../types/reports/DashboardData"

export const description = "A bar chart"

const chartConfig = {
  despesas: {
    label: "Despesas",
    color: "#000000",
  },
} satisfies ChartConfig

type Props = {
  title: string;
  subtitle: string;
  current_week: {
    data: {
      day: string;
      total: number;
    }
    status: string;
    insight: string;
  }[];
}

const dayMap: Record<string, string> = {
  Monday: "Seg",
  Tuesday: "Ter",
  Wednesday: "Qua",
  Thursday: "Qui",
  Friday: "Sex",
  Saturday: "Sab",
  Sunday: "Dom",
}

const weekOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export function ChartBarDefault({ title, subtitle, current_week }: Props) {
  const chartData = weekOrder.map((day) => {
    const item = current_week?.data?.find((d) => d.day === day)
    return {
      month: dayMap[day],
      despesas: item?.total ?? 0
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `R$ ${value.toFixed(2)}`}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={({ x, y, payload }) => {
                const currentDayIndex = new Date().getDay()
                const currentDayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][currentDayIndex]
                const currentLabel = dayMap[currentDayName]

                const isToday = payload.value === currentLabel

                return (
                  <text
                    x={x}
                    y={y + 15}
                    textAnchor="middle"
                    fill="#000"
                    fontWeight={isToday ? "bold" : "normal"}
                  >
                    {payload.value}
                  </text>
                )
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="despesas" fill="var(--color-despesas)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          {/* <TrendingUp className="h-4 w-4" /> Despesas aumentaram 5,2% em relação à semana anterior. */}
          {current_week?.data?.insight || ""}
        </div>
        <div className="text-muted-foreground leading-none">
          Informações dos últimos 7 dias.
        </div>
      </CardFooter>
    </Card>
  )
}
