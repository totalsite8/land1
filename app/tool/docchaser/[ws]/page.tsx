import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DemoShell from "../../../../components/demo/DemoShell";
import QueueWork from "../../../../components/work/QueueWork";
import { docchaserConfig } from "../../../../components/demo/queues";
import { isValidWs } from "../../../../lib/store";

export const metadata: Metadata = {
  title: "DocChaser — рабочая версия. Общая доска документов",
  robots: { index: false, follow: false }
};

export default async function Page({ params }: { params: Promise<{ ws: string }> }) {
  const { ws } = await params;
  if (!isValidWs(ws)) notFound();
  return (
    <DemoShell
      mode="work"
      id="docchaser"
      name="DocChaser"
      tag="10 / ДОКУМЕНТЫ"
      title={<>Конец поискам «где акт». <em>Он на общей доске.</em></>}
      lead="Доска общая: документы, ответственные и сроки видны всем по ссылке. Просроченные подсвечиваются сами — спрятаться за «я думал, ты» больше не выйдет."
    >
      <QueueWork config={docchaserConfig} ws={ws} />
    </DemoShell>
  );
}
