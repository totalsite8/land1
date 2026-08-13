import type { Metadata } from "next";
import DemoShell from "../../../components/demo/DemoShell";
import WorkBanner from "../../../components/work/WorkBanner";
import QueueDemo from "../../../components/demo/QueueDemo";
import { invoicenudgeConfig } from "../../../components/demo/queues";

export const metadata: Metadata = {
  title: "InvoiceNudge — попробовать демо. Цепочка напоминаний об оплате",
  description: "Неоплаченные счета и вежливая цепочка напоминаний: видно, кто платит после какого письма. Демо работает в браузере."
};

export default function Page() {
  return (
    <DemoShell
      id="invoicenudge"
      name="InvoiceNudge"
      tag="12 / ОПЛАТЫ"
      title={<>Вежливые напоминания <em>вместо неловких звонков.</em></>}
      lead="Счёт — в цепочку, дальше она ведёт сама: первое, второе, финальное. Карта оплат показывает, кто платит после какого касания."
    >
      <WorkBanner tool="invoicenudge" toolName="InvoiceNudge" />
      <QueueDemo config={invoicenudgeConfig} />
    </DemoShell>
  );
}
