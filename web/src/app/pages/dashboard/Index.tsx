import { DateExpensesSelect } from "../expenses/DateExpensesSelect";
import Expenses from "../expenses/Index";
import Incomes from "../incomes/Index";
import TabsContentPage from "./TabsContentPage";

function Index() {
    return (
        <div className="mx-auto px-4 mt-5">
            <section className="flex items-center justify-between">
                <h3 className="text-2xl font-bold tracking-tight">DASHBOARD</h3>
            
                < DateExpensesSelect monthYear={""} changeMonth={function (delta: number): void {
                    throw new Error("Function not implemented.");
                } } />
            </section>

            < TabsContentPage />
            
            <section className="flex gap-5 mt-5">
                < Expenses />
                < Incomes />
            </section>
        </div>
    )
}

export default Index;