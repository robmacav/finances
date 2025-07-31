import Expenses from "../expenses/Index";

type Props = {
  month: number;
  year: number;
};

function Index({ month, year }: Props) {
    return (
        < Expenses month={month} year={year} />
    )
}

export default Index;