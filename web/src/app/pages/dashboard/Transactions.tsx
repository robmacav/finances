import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import Expenses from "../expenses/Index";
import Incomes from "../incomes/Index";

type Props = {
  month: number;
  year: number;
};

function Transactions({ month, year }: Props) {
    return (
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
    )
}

export default Transactions;