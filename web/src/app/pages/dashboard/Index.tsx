import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { SiteHeader } from "../site-header";
import { DateExpensesSelect } from "./DateExpensesSelect";

import TabsContentPage from "./TabsContentPage";
import Transactions from '../transactions/Index';

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
    
    return (
        <div className="mx-auto p-5 sm:px-0 sm:pt-0 lg:px-10">
                <SiteHeader />
            
                <div className="flex justify-between items-center mt-5">
                    <div>
                        <h3 className="text-2xl font-bold tracking-tight">DASHBOARD</h3>
                        <small>{getFormattedMonthYear(year, month)}</small>
                    </div>
                    
                    < DateExpensesSelect changeMonth={changeMonth} />
                </div>

                <Tabs defaultValue="dashboard" className="">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-5 gap-4">
                        <TabsList>
                            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                            <TabsTrigger value="transactions">Transações</TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value="dashboard">
                        < TabsContentPage month={month} year={year} />
                    </TabsContent>
                    <TabsContent value="transactions">
                        < Transactions month={month} year={year} />
                    </TabsContent>
                </Tabs>
        </div>
    )
}

export default Index;