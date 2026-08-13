import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DemoShell from "../../../../components/demo/DemoShell";
import QueueWork from "../../../../components/work/QueueWork";
import { reviewreplyConfig } from "../../../../components/demo/queues";
import { isValidWs } from "../../../../lib/store";

export const metadata: Metadata = {
  title: "ReviewReply — рабочая версия. Общая очередь отзывов",
  robots: { index: false, follow: false }
};

export default async function Page({ params }: { params: Promise<{ ws: string }> }) {
  const { ws } = await params;
  if (!isValidWs(ws)) notFound();
  return (
    <DemoShell
      mode="work"
      id="reviewreply"
      name="ReviewReply"
      tag="09 / ОТЗЫВЫ"
      title={<>Ни один отзыв <em>не висит без ответа.</em></>}
      lead="Очередь общая: кто бы ни внёс отзыв, он ждёт ответа на одной доске с возрастом ожидания. Отвечает человек — инструмент не даёт отзыву потеряться между сменами."
    >
      <QueueWork config={reviewreplyConfig} ws={ws} />
    </DemoShell>
  );
}
