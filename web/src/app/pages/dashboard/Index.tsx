import { useState } from "react";
import { DateExpensesSelect } from "../expenses/DateExpensesSelect";

import TabsContentPage from "./TabsContentPage";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SiteHeader } from "../site-header";

import Transactions from './Transactions';

function Index() {
    const [month, setMonth] = useState(new Date().getMonth() + 1); // 1 a 12
    const [year, setYear] = useState(new Date().getFullYear());

    function changeMonth(delta: number) {
      const newDate = new Date(year, month - 1 + delta);
      setMonth(newDate.getMonth() + 1);
      setYear(newDate.getFullYear());
    }
    
    return (
        <div className="mx-auto p-5 sm:px-0 sm:pt-0 lg:px-10">
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

                <Tabs defaultValue="expenses" className="">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-5 gap-4">
                        <TabsList>
                            <TabsTrigger value="expenses">Overview</TabsTrigger>
                            <TabsTrigger value="incomes">Transações</TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value="expenses">
                        < TabsContentPage month={month} year={year} />
                    </TabsContent>
                    <TabsContent value="incomes">
                        < Transactions month={month} year={year} />
                    </TabsContent>
                </Tabs>
        </div>
    )
}

export default Index;