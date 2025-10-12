"use client"

import { Minus, TrendingDown, TrendingUp, XCircle } from "lucide-react"
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

import { useIsMobile } from "@/hooks/use-mobile"

export const description = "A bar chart"

const chartConfig = {
  despesas: {
    label: "Despesas",
    color: "#A23E48",
  },
} satisfies ChartConfig

type Props = {
  title: string;
  subtitle: string;
  data: {
    data: {
      day: string;
      total: number;
    }
  }[];
  status: string;
  insight: {
    description: string;
    status: string;
  }
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

type Status = "increase" | "decrease" | "stable" | "no_expenses"

export function getStatusIcon(status: Status) {
  switch (status) {
    case "increase":
      return <TrendingUp className="h-4 w-4" />
    case "decrease":
      return <TrendingDown className="h-4 w-4" />
    case "stable":
      return <Minus className="h-4 w-4" />
    case "no_expenses":
      return <XCircle className="h-4 w-4" />
    default:
      return null
  }
}

export default function WeeklyExpensesOverview({ data }: Props) {
  const isMobile = useIsMobile();

  const chartData = weekOrder.map((day) => {
    const item = data?.data?.find((d) => d.day === day)
    return {
      month: dayMap[day],
      despesas: item?.total ?? 0
    }
  })

const totalDespesas = chartData
  .reduce((acc, cur) => acc + cur.despesas, 0)
  .toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo Semanal de Despesas</CardTitle>
        <CardDescription>{totalDespesas}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <YAxis
              stroke="#888888"
              fontSize={isMobile ? 10 : 12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `R$ ${value.toFixed(2)}`}
              width={isMobile ? 75 : 100}
              tickMargin={10}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              interval={0} 
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
                    fontSize={isMobile ? 10 : 12}
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
          {getStatusIcon(data?.insight?.status)} {data?.insight?.description}
        </div>
      </CardFooter>
    </Card>
  )
}
