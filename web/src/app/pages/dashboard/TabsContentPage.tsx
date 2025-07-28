import { CircleDollarSign, TrendingDown, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useIncomesExpensesAvailableByMonthYear } from '../../../hooks/utils/dashboard/useIncomesExpensesAvailableByMonthYear';
import { Overview2 } from "./Overview2";
import PieChart1 from "./PieChart1";
import { ChartBarDefault } from "./bar-chart";
import { ChartBarHorizontal } from "./bar-chart-horizontal";
import { ChartBarLabelCustom } from "./char-bar-custom-label";

type Props = {
  month: number;
  year: number;
};

function TabsContentPage({ month, year }: Props) {
  const monthYear = `${String(month).padStart(2, "0")}${year}`;

    const { data, loading, error } = useIncomesExpensesAvailableByMonthYear(monthYear);

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>Erro: {error}</p>;

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
              <div className="text-2xl font-bold">{data?.available}</div>
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
              <div className="text-2xl font-bold">{data?.incomes}</div>
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
              <div className="text-2xl font-bold">{data?.expenses}</div>
              <p className="text-xs text-muted-foreground">
                -20.1% em relação ao mês passado
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-4 items-stretch">
          <div className="flex flex-col col-span-6 gap-4">
            < ChartBarDefault title="Resumo Semanal de Despesas" subtitle="Monitoramento Diário das Despesas" /> {/* <Overview2 title="Despesas" /> */}
            < ChartBarLabelCustom title="Gastos mais frequentes" subtitle="" /> {/* Overview2 title="Gastos mais recorrentes" /> */}
            <Overview2 title="Fluxo Financeiro Anual" />
          </div>
          <div className="col-span-6">
            <PieChart1 month={month} year={year} />
          </div>
        </div>
      </section>
    )
}

export default TabsContentPage