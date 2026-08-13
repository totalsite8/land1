import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DemoShell from "../../../../components/demo/DemoShell";
import OnboardOneWork from "../../../../components/work/OnboardOneWork";
import { isValidWs } from "../../../../lib/store";

export const metadata: Metadata = {
  title: "OnboardOne — рабочая версия. Общий маршрут новичка",
  robots: { index: false, follow: false }
};

export default async function Page({ params }: { params: Promise<{ ws: string }> }) {
  const { ws } = await params;
  if (!isValidWs(ws)) notFound();
  return (
    <DemoShell
      mode="work"
      id="onboardone"
      name="OnboardOne"
      tag="РАБОЧАЯ ВЕРСИЯ · ОБУЧЕНИЕ"
      title={<>Маршрут новичка. <em>Один на всю команду.</em></>}
      lead="Новичок идёт по шагам на своём телефоне, наставник видит прогресс на своём. Добавленные шаги сохраняются в команде — следующий новичок унаследует накопленный маршрут."
    >
      <OnboardOneWork ws={ws} />
    </DemoShell>
  );
}
