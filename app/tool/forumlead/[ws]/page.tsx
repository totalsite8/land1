import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DemoShell from "../../../../components/demo/DemoShell";
import QueueWork from "../../../../components/work/QueueWork";
import { forumleadConfig } from "../../../../components/demo/queues";
import { isValidWs } from "../../../../lib/store";

export const metadata: Metadata = {
  title: "ForumLead — рабочая версия. Общая подборка вопросов клиентов",
  robots: { index: false, follow: false }
};

export default async function Page({ params }: { params: Promise<{ ws: string }> }) {
  const { ws } = await params;
  if (!isValidWs(ws)) notFound();
  return (
    <DemoShell
      mode="work"
      id="forumlead"
      name="ForumLead"
      tag="04 / ЛИДЫ ИЗ ЧАТОВ"
      title={<>Клиенты уже спрашивают. <em>Видно, кто ответил.</em></>}
      lead="Подборка общая: вопросы, которые занесла любая смена, видны всем по ссылке. Отвечает человек с вашего аккаунта — инструмент гарантирует, что вопрос не потерялся и не ждёт ответа неделями."
    >
      <QueueWork config={forumleadConfig} ws={ws} />
    </DemoShell>
  );
}
