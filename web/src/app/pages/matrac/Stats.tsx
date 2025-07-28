import { CircleDollarSign, TrendingDown, TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card"

function Stats() {
    return (
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3 my-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Proteinas</CardTitle>
                    <CircleDollarSign />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">160g</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Carboidratos</CardTitle>
                    <TrendingUp className="inline mr-2" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">480g</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Gorduras</CardTitle>
                    <TrendingDown className="inline mr-2" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">64g</div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Stats;