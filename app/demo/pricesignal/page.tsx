import type { Metadata } from "next";
import DemoShell from "../../../components/demo/DemoShell";
import WorkBanner from "../../../components/work/WorkBanner";
import { PriceSignalDemo } from "../../../components/demo/ThresholdDemo";

export const metadata: Metadata = {
  title: "PriceSignal — попробовать демо. Сигнал «пора пересмотреть цену»",
  description: "Позиции, цена и себестоимость: инструмент сам подаёт сигнал, когда маржа проходит порог. Демо работает в браузере."
};

export default function Page() {
  return (
    <DemoShell
      id="pricesignal"
      name="PriceSignal"
      tag="08 / ЦЕНЫ"
      title={<>Издержки выросли тихо. <em>Сигнал — вовремя.</em></>}
      lead="Меняйте цену и себестоимость прямо в карточках — сигнал срабатывает сам, как только маржа падает ниже порога. Цены по-прежнему решает человек."
    >
      <WorkBanner tool="pricesignal" toolName="PriceSignal" />
      <PriceSignalDemo />
    </DemoShell>
  );
}
