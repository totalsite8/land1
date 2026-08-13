import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DemoShell from "../../../../components/demo/DemoShell";
import QueueWork from "../../../../components/work/QueueWork";
import { partnerreachConfig } from "../../../../components/demo/queues";
import { isValidWs } from "../../../../lib/store";

export const metadata: Metadata = {
  title: "PartnerReach — рабочая версия. Общий список договорённостей",
  robots: { index: false, follow: false }
};

export default async function Page({ params }: { params: Promise<{ ws: string }> }) {
  const { ws } = await params;
  if (!isValidWs(ws)) notFound();
  return (
    <DemoShell
      mode="work"
      id="partnerreach"
      name="PartnerReach"
      tag="06 / ПАРТНЁРЫ"
      title={<>Договорённости не умирают. <em>Их видно всем.</em></>}
      lead="Список общий: договорённости и даты следующего контакта на одной доске у всей команды. Просроченные связи подсвечиваются сами — канал не остывает незаметно."
    >
      <QueueWork config={partnerreachConfig} ws={ws} />
    </DemoShell>
  );
}
