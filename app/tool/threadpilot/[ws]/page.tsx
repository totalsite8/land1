import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DemoShell from "../../../../components/demo/DemoShell";
import QueueWork from "../../../../components/work/QueueWork";
import { threadpilotConfig } from "../../../../components/demo/queues";
import { isValidWs } from "../../../../lib/store";

export const metadata: Metadata = {
  title: "ThreadPilot — рабочая версия. Общее поле диалогов",
  robots: { index: false, follow: false }
};

export default async function Page({ params }: { params: Promise<{ ws: string }> }) {
  const { ws } = await params;
  if (!isValidWs(ws)) notFound();
  return (
    <DemoShell
      mode="work"
      id="threadpilot"
      name="ThreadPilot"
      tag="14 / ДИАЛОГИ"
      title={<>Десять чатов. <em>Одно общее поле долга.</em></>}
      lead="Поле общее: долг по ответам со всех каналов виден всей команде. Отвечаете по-прежнему там, где привыкли — здесь живёт только картина долга."
    >
      <QueueWork config={threadpilotConfig} ws={ws} />
    </DemoShell>
  );
}
