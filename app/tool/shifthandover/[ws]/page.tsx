import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DemoShell from "../../../../components/demo/DemoShell";
import ShiftHandoverWork from "../../../../components/work/ShiftHandoverWork";
import { isValidWs } from "../../../../lib/store";

export const metadata: Metadata = {
  title: "ShiftHandover — рабочая версия. Общая доска смен",
  robots: { index: false, follow: false }
};

export default async function Page({ params }: { params: Promise<{ ws: string }> }) {
  const { ws } = await params;
  if (!isValidWs(ws)) notFound();
  return (
    <DemoShell
      mode="work"
      id="shifthandover"
      name="ShiftHandover"
      tag="РАБОЧАЯ ВЕРСИЯ · СМЕНЫ"
      title={<>Доска смены. <em>Одна на все смены.</em></>}
      lead="Вечерняя смена оставляет записи — утренняя читает на своём устройстве и отмечает принятое. Ничего не зависает в личных головах: открытых записей не бывает тайных."
    >
      <ShiftHandoverWork ws={ws} />
    </DemoShell>
  );
}
