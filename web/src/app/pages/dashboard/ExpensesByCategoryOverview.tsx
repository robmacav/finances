"use client"

import { useState } from "react"
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

type Item = {
  id: number
  summary: string
  value: number
  formated: string
}

type Props = {
  data: {
    category: {
      summary: string;
      color: string;
    }
    total: {
      original: number;
      formated: string;
    }
    items: Item[];
  }[];
}

function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function ExpensesByCategoryOverview({ data }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<Props["data"][number] | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  const chartData = data?.map((item) => ({
    category: item.category.summary,
    total: item.total.original,
    items: item.items,
    fill: `#${item.category.color.replace(/^#/, '')}`
  }))

  const chartConfig = data?.reduce((acc: any, item: any) => {
    const key = item.category.summary
    acc[key] = {
      label: key,
      color: `#${item.category.color.replace(/^#/, '')}`
    }
    return acc
  }, {} as Record<string, { label: string; color: string }>)

  const openModal = (item: Props["data"][number]) => {
    setSelectedCategory(item)
    setIsViewDialogOpen(true)
  }

  const closeModal = () => setIsViewDialogOpen(false)

  if (data.length === 0) return null

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
        <div className="w-full">
          <ul className="w-full p-5">
            {chartData.map((item, index) => (
              <li
                key={index}
                className="border-b last:border-b-0 pb-3 mt-5 cursor-pointer"
                onClick={() => openModal(item as any)}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center min-w-[100px]">
                    <span
                      className="inline-block w-4 h-4 rounded-full mr-2 flex-shrink-0"
                      style={{ backgroundColor: item.fill }}
                      aria-hidden="true"
                    ></span>
                    <Label className="text-muted-foreground whitespace-nowrap cursor-pointer">
                      {item.category}
                    </Label>
                  </div>
                  <span className="text-sm text-right font-medium break-words max-w-sm text-foreground">
                    {formatBRL(item.total)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardFooter>

<Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
  <DialogContent className="md:min-w-3xl xl:min-w-6xl">
    <DialogHeader>
      <DialogTitle>{selectedCategory?.category}</DialogTitle>
      <DialogDescription></DialogDescription>
    </DialogHeader>
    <div className="mt-5 max-h-[400px] overflow-y-auto grid gap-6 pe-5">
      {selectedCategory?.items.map((item) => (
        <div
          className="flex items-start justify-between gap-4 pb-1"
          key={item.id}
        >
          <Label className="text-muted-foreground min-w-[100px]">
            {item.summary}
          </Label>
          <span className="text-right font-medium break-words max-w-sm text-foreground">
            {item.formated}
          </span>
        </div>
      ))}
    </div>

    <DialogFooter className="mt-4">
      <DialogClose asChild>
        <Button className="px-10">Fechar</Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>

    </Card>
  )
}

export default ExpensesByCategoryOverview
