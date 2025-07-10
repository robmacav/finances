import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card"

// import { Overview } from "../dashboard/Overview"

import { useIncomesExpensesAvailableByMonthYear } from '../../../hooks/utils/dashboard/useIncomesExpensesAvailableByMonthYear';
import { Overview2 } from "./Overview2";
import PieChart1 from "./PieChart1";

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
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-dollar-sign-icon lucide-circle-dollar-sign"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-trending-up-icon lucide-trending-up"><path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/></svg>
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-trending-down-icon lucide-trending-down"><path d="M16 17h6v-6"/><path d="m22 17-8.5-8.5-5 5L2 7"/></svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{data?.expenses}</div>
                    <p className="text-xs text-muted-foreground">
                      -20.1% em relação ao mês passado
                    </p>
                  </CardContent>
                </Card>

              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
                <Card className="col-span-8">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Overview2 />
                  </CardContent>
                </Card>
                < PieChart1 month={month} year={year} />
                {/* < ChartPieInteractive /> */}
              </div>
      </section>
    )
}

export default TabsContentPage