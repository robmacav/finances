import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { SiteHeader } from "../../SiteHeader";
import { MonthlyNavigation } from "../../MonthlyNavigation";

import Transactions from '../transactions/Index';

import KeyMetrics from "./KeyMetrics";
import AnnualCashFlowOverview from "./AnnualCashFlowOverview";
import ExpensesByCategoryOverview from "./ExpensesByCategoryOverview";
import WeeklyExpensesOverview from "./WeeklyExpensesOverview";
import MostFrequentExpensesOverview from "./MostFrequentExpensesOverview";
import { useDashboardData } from "@/hooks/reports/dashboard/useData";

function getFormattedMonthYear(year: number, month: number) {
  return new Date(year, month - 1)
    .toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
    .replace(/^./, (str) => str.toUpperCase());
}

function Index() {
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    function changeMonth(delta: number) {
      const newDate = new Date(year, month - 1 + delta);
      setMonth(newDate.getMonth() + 1);
      setYear(newDate.getFullYear());
    }

    const monthYear = `${String(month).padStart(2, "0")}${year}`;
    const { data } = useDashboardData(monthYear);
    
    return (
        <div className="mx-auto p-5 sm:px-0 sm:pt-0 sm:px-5 md:px-10">
                <SiteHeader />
            
                <div className="flex justify-between items-center mt-5">
                    <div>
                        <h6 className="text-2xl font-bold tracking-tight">{getFormattedMonthYear(year, month)}</h6>
                    </div>
                    
                    < MonthlyNavigation changeMonth={changeMonth} />
                </div>

                <Tabs defaultValue="dashboard" className="">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-5 gap-4">
                        <TabsList>
                            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                            <TabsTrigger value="transactions">Transações</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="dashboard">
                        <section>
                            < KeyMetrics data={data} />
                            <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-4 items-stretch">
                                <div className="flex flex-col col-span-6 gap-4">
                                    < WeeklyExpensesOverview data={data?.current_week || []} />
                                    < MostFrequentExpensesOverview data={data?.most_frequents || []} />
                                    < AnnualCashFlowOverview data={data?.total_by_months || []} />
                                </div>
                                <div className="col-span-6">
                                    <ExpensesByCategoryOverview data={data?.expenses_by_category || []} />
                                </div>
                            </div>
                        </section>
                    </TabsContent>
                    <TabsContent value="transactions">
                        < Transactions month={month} year={year} />
                    </TabsContent>
                </Tabs>
        </div>
    )
}

export default Index;