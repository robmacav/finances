import { CircleDollarSign, TrendingDown, TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card"

import { Skeleton } from "@/components/ui/skeleton"

export default function KeyMetrics({ data }: any) {
    return (
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3 my-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Disponível
              </CardTitle>
              <CircleDollarSign />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data ? data.summary.available.value : <Skeleton className="w-24 h-6" />}</div>
              <div className="text-xs text-muted-foreground">
                {data ? data?.summary.available.insight : <Skeleton className="w-24 h-6" />}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Receitas
              </CardTitle>
              <TrendingUp className="inline mr-2" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data ? data?.summary.incomes.value : <Skeleton className="w-24 h-6" />}</div>
              <div className="text-xs text-muted-foreground">
                {data ? data?.summary.incomes.insight : <Skeleton className="w-24 h-6" />}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Despesas
              </CardTitle>
              <TrendingDown className="inline mr-2" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data ? data?.summary.expenses.value : <Skeleton className="w-24 h-6" />}</div>
              <div className="text-xs text-muted-foreground">
                {data ? data?.summary.expenses.insight : <Skeleton className="w-24 h-6" />}
              </div>
            </CardContent>
          </Card>
        </div>
    )
}