"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

import { useMostFrequentsByMonthYear } from '@/hooks/reports/expenses/useMostFrequentsByMonthYear' // ajuste o caminho conforme seu projeto

type Props = {
  title: string
  subtitle?: string
  data: {
    summary: string;
    qtd: number;
    total: number;
  }[];
}

const chartConfig = {
  desktop: {
    label: "Total",
    color: "#000000"
  },
  mobile: {
    label: "Qtd",
    color: "var(--chart-2)"
  },
  label: {
    color: "var(--background)"
  },
} satisfies ChartConfig

export function ChartBarLabelCustom({ title, subtitle, data }: Props) {
  const chartData = data?.map((item: any) => ({
    month: `${item.summary} (${item.qtd})`,
    desktop: item.total,
    mobile: item.qtd
  })).slice(0, 6)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ right: 16 }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="month"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              hide
            />
            <XAxis dataKey="desktop" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="desktop"
              layout="vertical"
              fill={chartConfig.desktop.color}
              radius={4}
            >
              <LabelList
                dataKey="month"
                position="insideLeft"
                offset={8}
                fill="#fff"
                fontSize={12}
              />
              <LabelList
                dataKey="desktop"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
                formatter={(value: any) =>
                  Number(value).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })
                }
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
