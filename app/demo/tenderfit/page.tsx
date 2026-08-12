import type { Metadata } from "next";
import DemoShell from "../../../components/demo/DemoShell";
import TenderFitDemo from "../../../components/demo/TenderFitDemo";

export const metadata: Metadata = {
  title: "TenderFit — попробовать демо. Тендеры под ваши критерии",
  description: "Поток закупок проходит через ваш фильтр: тип работ, бюджет, регион. На столе — только подходящие. Демо работает в браузере."
};

export default function Page() {
  return (
    <DemoShell
      id="tenderfit"
      name="TenderFit"
      tag="07 / ТЕНДЕРЫ"
      title={<>В ленте сотни закупок. <em>На столе — ваши.</em></>}
      lead="Задайте тип работ, регион и минимальный бюджет — лента сама отберёт подходящие. Отметки «наше / не наше» точнят подбор каждую неделю."
    >
      <TenderFitDemo />
    </DemoShell>
  );
}
