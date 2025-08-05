"use client"

import { Label } from "@/components/ui/label"
import { Pie, PieChart, ResponsiveContainer } from "recharts"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Props = {
  data: {
    category: {
      summary: string;
      color: string;
    }
    total: number;
  }
};

function PieChart1({ data }: Props) {
  const chartData = data?.map((item) => ({
    category: item.category.summary,
    total: item.total,
    fill: `#${item.category.color.replace(/^#/, '')}`
  }));

  const chartConfig = data?.reduce((acc: any, item: any) => {
    const key = item.category.summary;
    acc[key] = {
      label: key,
      color: `#${item.category.color.replace(/^#/, '')}`
    };
    return acc;
  }, {} as Record<string, { label: string; color: string }>);

function dados() {
  return (
    <div className="w-full">
      <ul className="w-full p-5">
        {chartData.map(
          (
            item: { category: string; total: number; fill: string },
            index: number
          ) => (
            <li
              key={index}
              className="border-b last:border-b-0 pb-3 mt-5"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center min-w-[100px]">
                  <span
                    className="inline-block w-4 h-4 rounded-full mr-2 flex-shrink-0"
                    style={{ backgroundColor: item.fill }}
                    aria-hidden="true"
                  ></span>
                  <Label className="text-muted-foreground whitespace-nowrap">
                    {item.category}
                  </Label>
                </div>
                <span className="text-right font-medium break-words max-w-sm text-foreground">
                  R$ {item.total}
                </span>
              </div>
            </li>
          )
        )}
      </ul>
    </div>
  );
}



  return (
    <Card className="h-full">
      <CardHeader className="items-center pb-0 flex flex-row">
        <CardTitle>Categorias</CardTitle>
      </CardHeader>
      <CardContent>
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
      <CardFooter>
        {dados()}
      </CardFooter>
    </Card>
  )
}

export default PieChart1
