import { CircleDollarSign, TrendingDown, TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card"

import { Skeleton } from "@/components/ui/skeleton"

import { Overview2 } from "./Overview2";
import PieChart1 from "./PieChart1";
import { ChartBarDefault } from "./bar-chart";
import { ChartBarLabelCustom } from "./char-bar-custom-label";

import { useDashboardData } from "@/hooks/reports/dashboard/useData";

type Props = {
  month: number;
  year: number;
};

function TabsContentPage({ month, year }: Props) {
  const monthYear = `${String(month).padStart(2, "0")}${year}`;
  const { data } = useDashboardData(monthYear);

    return (
      <section>
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3 my-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Disponível
              </CardTitle>
              <CircleDollarSign />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data ? data.summary.available : <Skeleton className="w-24 h-6" />}</div>
              <p className="text-xs text-muted-foreground">
                +18% em relação ao mês passado
              </p>
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
              <div className="text-2xl font-bold">{data ? data?.summary.incomes : <Skeleton className="w-24 h-6" />}</div>
              <p className="text-xs text-muted-foreground">
                +20.1% em relação ao mês passado
              </p>
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
              <div className="text-2xl font-bold">{data ? data?.summary.expenses : <Skeleton className="w-24 h-6" />}</div>
              <p className="text-xs text-muted-foreground">
                -20.1% em relação ao mês passado
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-4 items-stretch">
          <div className="flex flex-col col-span-6 gap-4">
            < ChartBarDefault title="Resumo Semanal de Despesas" subtitle="Monitoramento Diário das Despesas" data={data?.current_week || []} />
            < ChartBarLabelCustom title="Gastos mais frequentes" subtitle="" data={data?.most_frequents || []} />
            <Overview2 title="Fluxo Financeiro Anual" data={data?.total_by_months || []} />
          </div>
          <div className="col-span-6">
            <PieChart1 data={data?.expenses_by_category || []} />
          </div>
        </div>
      </section>
    )
}

export default TabsContentPage