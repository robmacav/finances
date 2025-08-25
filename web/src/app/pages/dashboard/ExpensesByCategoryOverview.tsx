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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

type Props = {
  data: {
    category: {
      summary: string;
      color: string;
    }
    total: {
      original: string;
      formated: string;
    }
    items: {
      summary: string;
      formated: string;
    }
  }
};

function decimalToInteger(value: number): string {
  const integerPart = Math.floor(value);
  return integerPart.toLocaleString("pt-BR");
}

function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function ExpensesByCategoryOverview({ data }: Props) {
  const chartData = data?.map((item) => ({
    category: item.category.summary,
    total: item.total.original,
    items: item.items,
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

  console.log("data: ", chartData);

  function dados() {
    return (
      <div className="w-full">
        <ul className="w-full p-5">
          {chartData.map(
            (
              item: { category: string; total: number; fill: string, items: [] },
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
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Label className="text-muted-foreground whitespace-nowrap">
                          {item.category}
                        </Label>
                      </TooltipTrigger>
                      <TooltipContent>
                        <ul>
                        {item.items?.map((item: any) => (
                          <li key={item.id}>
                            {item.summary} — {item.formated}
                          </li>
                        ))}
                        </ul>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="text-sm text-right font-medium break-words max-w-sm text-foreground">
                    {formatBRL(item.total)}
                  </span>
                </div>
              </li>
            )
          )}
        </ul>
      </div>
    )
  }

  if (data.length === 0) {
    return null;
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
              <Pie 
                data={chartData} 
                dataKey="total" 
                nameKey="category" 
                outerRadius={150} 
              />
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

export default ExpensesByCategoryOverview
