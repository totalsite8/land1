import type { Metadata } from "next";
import DemoShell from "../../../components/demo/DemoShell";
import { StockAlertDemo } from "../../../components/demo/ThresholdDemo";

export const metadata: Metadata = {
  title: "StockAlert — попробовать демо. Сигнал о дефиците до нуля",
  description: "Остатки, продажи в день и неснижаемый запас: список закупки собирается сам, пока позиция ещё не ушла в ноль. Демо работает в браузере."
};

export default function Page() {
  return (
    <DemoShell
      id="stockalert"
      name="StockAlert"
      tag="13 / ОСТАТКИ"
      title={<>Дефицит виден <em>за дни, а не в пик продаж.</em></>}
      lead="Меняйте остаток и темп продаж — инструмент сам считает, на сколько дней хватит и что пора дозаказать. Позиция больше не кончается в пятницу вечером."
    >
      <StockAlertDemo />
    </DemoShell>
  );
}
