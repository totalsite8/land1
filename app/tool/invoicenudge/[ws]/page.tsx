import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DemoShell from "../../../../components/demo/DemoShell";
import QueueWork from "../../../../components/work/QueueWork";
import { invoicenudgeConfig } from "../../../../components/demo/queues";
import { isValidWs } from "../../../../lib/store";

export const metadata: Metadata = {
  title: "InvoiceNudge — рабочая версия. Общая цепочка напоминаний",
  robots: { index: false, follow: false }
};

export default async function Page({ params }: { params: Promise<{ ws: string }> }) {
  const { ws } = await params;
  if (!isValidWs(ws)) notFound();
  return (
    <DemoShell
      mode="work"
      id="invoicenudge"
      name="InvoiceNudge"
      tag="12 / ОПЛАТЫ"
      title={<>Вежливые напоминания <em>вместо неловких звонков.</em></>}
      lead="Цепочка общая: счета и их статусы на одной доске у всей команды. Видно, кто платит после какого касания — и кого пора двигать дальше."
    >
      <QueueWork config={invoicenudgeConfig} ws={ws} />
    </DemoShell>
  );
}
