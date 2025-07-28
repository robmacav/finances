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

export const description = "A bar chart"

const chartData = [
  { month: "Seg", desktop: 186 },
  { month: "Ter", desktop: 305 },
  { month: "Qua", desktop: 237 },
  { month: "Qui", desktop: 73 },
  { month: "Sex", desktop: 209 },
  { month: "Sab", desktop: 214 },
  { month: "Dom", desktop: 290 }
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#000000",
  },
} satisfies ChartConfig

type Props = {
  title: string;
  subtitle: string;
};

export function ChartBarDefault({ title, subtitle }: Props) {
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
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent> 
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          <TrendingUp className="h-4 w-4" /> Despesas aumentaram 5,2% em relação à semana anterior.
        </div>
        <div className="text-muted-foreground leading-none">
          Informações dos últimos 7 dias.
        </div>
      </CardFooter>
    </Card>
  )
}
