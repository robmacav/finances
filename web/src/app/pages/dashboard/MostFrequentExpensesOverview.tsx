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

type Props = {
  data: {
    summary: string;
    qtd: number;
    total: number;
  }[];
}

const chartConfig = {
  desktop: {
    label: "Total",
    color: "#A23E48"
  },
  mobile: {
    label: "Qtd",
    color: "var(--chart-2)"
  },
  label: {
    color: "var(--background)"
  },
} satisfies ChartConfig

import { useIsMobile } from "@/hooks/use-mobile"

export default function MostFrequentExpensesOverview({ data }: Props) {
  const isMobile = useIsMobile();

  const chartData = data?.map((item: any) => ({
    month: `${item.summary} (${item.qtd})`,
    desktop: item.total,
    mobile: item.qtd
  })).slice(0, 6)

  if (data.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gastos mais frequentes</CardTitle>
        <CardDescription></CardDescription>
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
              axisLine={false}
              tickMargin={10}
              width={isMobile ? 130 : 150}
              fontSize={isMobile ? 10 : 12}
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
                dataKey="desktop"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={isMobile ? 10 : 12}
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
