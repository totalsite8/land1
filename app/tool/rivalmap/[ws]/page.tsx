import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DemoShell from "../../../../components/demo/DemoShell";
import RivalLogWork from "../../../../components/work/RivalLogWork";
import { isValidWs } from "../../../../lib/store";

export const metadata: Metadata = {
  title: "RivalMap — рабочая версия. Общая сводка ходов конкурентов",
  robots: { index: false, follow: false }
};

export default async function Page({ params }: { params: Promise<{ ws: string }> }) {
  const { ws } = await params;
  if (!isValidWs(ws)) notFound();
  return (
    <DemoShell
      mode="work"
      id="rivalmap"
      name="RivalMap"
      tag="05 / КОНКУРЕНТЫ"
      title={<>Ходы конкурентов — <em>из общей сводки, а не от клиента.</em></>}
      lead="Сводка общая: факты фиксирует любой наблюдатель команды, неделя складывается в картину сама. Список конкурентов и записи видны всем по ссылке."
    >
      <RivalLogWork ws={ws} />
    </DemoShell>
  );
}
