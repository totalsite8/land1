import type { Metadata } from "next";
import DemoShell from "../../../components/demo/DemoShell";
import WorkBanner from "../../../components/work/WorkBanner";
import DedupDemo from "../../../components/demo/DedupDemo";

export const metadata: Metadata = {
  title: "LeadDedup — попробовать демо. Дубли лидов помечены до работы",
  description: "Добавьте клиента дважды с разным форматом телефона — сверка найдёт совпадение до начала работы. Демо работает в браузере."
};

export default function Page() {
  return (
    <DemoShell
      id="leaddedup"
      name="LeadDedup"
      tag="11 / ДУБЛИ"
      title={<>Один клиент. <em>Одна история.</em></>}
      lead="+7 911…, 8 911… и @ник с одного контакта — это один и тот же клиент. Сверка ловит его при добавлении, а не после третьего повторного звонка."
    >
      <WorkBanner tool="leaddedup" toolName="LeadDedup" />
      <DedupDemo />
    </DemoShell>
  );
}
