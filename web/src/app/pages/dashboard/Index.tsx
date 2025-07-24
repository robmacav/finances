import { useState } from "react";
import { DateExpensesSelect } from "../expenses/DateExpensesSelect";
import Expenses from "../expenses/Index";
import Incomes from "../incomes/Index";
import TabsContentPage from "./TabsContentPage";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SiteHeader } from "../site-header";

function Index() {
    const [month, setMonth] = useState(new Date().getMonth() + 1); // 1 a 12
    const [year, setYear] = useState(new Date().getFullYear());

    function changeMonth(delta: number) {
      const newDate = new Date(year, month - 1 + delta);
      setMonth(newDate.getMonth() + 1);
      setYear(newDate.getFullYear());
    }
    
    return (
        <div className="mx-auto p-5 sm:p-0 lg:px-10">
            <div className="">
                <SiteHeader />
            
                <section className="flex items-center justify-between mt-5">
                    <div>
                        <h3 className="text-2xl font-bold tracking-tight">DASHBOARD</h3>
                        <small>
                            {new Date(year, month - 1)
                                .toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
                                .replace(/^./, (str) => str.toUpperCase())}
                        </small>
                    </div>
                    
                    < DateExpensesSelect month={month} year={year} changeMonth={changeMonth} />
                </section>

                < TabsContentPage month={month} year={year} />
                
                <section>
                    <Tabs defaultValue="expenses" className="">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-5 gap-4">
                        <h3 className="text-2xl font-bold tracking-tight">TRANSAÇÕES</h3>
                        <TabsList>
                            <TabsTrigger value="expenses">Despesas</TabsTrigger>
                            <TabsTrigger value="incomes">Receitas</TabsTrigger>
                        </TabsList>
                        </div>

                        <TabsContent value="expenses">< Expenses month={month} year={year} /></TabsContent>
                        <TabsContent value="incomes">< Incomes month={month} year={year} /></TabsContent>
                    </Tabs>
                </section>
            </div>
        </div>
    )
}

export default Index;