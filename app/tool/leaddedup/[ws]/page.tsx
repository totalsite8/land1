import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DemoShell from "../../../../components/demo/DemoShell";
import DedupWork from "../../../../components/work/DedupWork";
import { isValidWs } from "../../../../lib/store";

export const metadata: Metadata = {
  title: "LeadDedup — рабочая версия. Общая база без дублей",
  robots: { index: false, follow: false }
};

export default async function Page({ params }: { params: Promise<{ ws: string }> }) {
  const { ws } = await params;
  if (!isValidWs(ws)) notFound();
  return (
    <DemoShell
      mode="work"
      id="leaddedup"
      name="LeadDedup"
      tag="11 / ДУБЛИ"
      title={<>Один клиент. <em>Одна общая история.</em></>}
      lead="База общая: лиды, которые вносит вся команда, сверяются между собой при добавлении. Дубль помечается до начала работы — а не после третьего повторного звонка."
    >
      <DedupWork ws={ws} />
    </DemoShell>
  );
}
