import { TooltipProps } from "recharts";

type PiePayloadItem = {
  name: string;
  value: number;
  fill: string;
  // Aqui pode ter outras propriedades, incluindo "payload" com dados originais
  payload?: any;
};

const CustomPieTooltip = ({
  active,
  payload: payloadArray, // renomeei para deixar claro que é um array
}: TooltipProps<any, any>) => {
  if (active && payloadArray && payloadArray.length > 0) {
    const item = payloadArray[0] as PiePayloadItem;

    return (
      <div className="rounded-md bg-background p-2 shadow border text-sm flex items-center gap-2">
        <span
          className="inline-block w-3 h-3 rounded-full"
          style={{ backgroundColor: item.fill }}
        ></span>

        <span className="text-muted-foreground whitespace-nowrap">{item.name}</span>

        <span className="font-medium text-foreground ml-auto">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(item.value)}
        </span>
      </div>
    );
  }

  return null;
};

export default CustomPieTooltip;
