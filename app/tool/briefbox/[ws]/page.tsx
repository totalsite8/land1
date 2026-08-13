import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DemoShell from "../../../../components/demo/DemoShell";
import BriefBoxWork from "../../../../components/work/BriefBoxWork";
import { isValidWs } from "../../../../lib/store";

export const metadata: Metadata = {
  title: "BriefBox — рабочая версия. Общая доска заявок",
  robots: { index: false, follow: false }
};

export default async function Page({ params }: { params: Promise<{ ws: string }> }) {
  const { ws } = await params;
  if (!isValidWs(ws)) notFound();
  return (
    <DemoShell
      mode="work"
      id="briefbox"
      name="BriefBox"
      tag="РАБОЧАЯ ВЕРСИЯ · ЗАЯВКИ"
      title={<>Заявки команды — <em>одна общая доска.</em></>}
      lead="Всё, что добавит любой из команды, видно у всех: то же самое окно откройте на телефоне менеджера — он увидит ваши заявки и изменит их статусы. Доска обновляется сама."
    >
      <BriefBoxWork ws={ws} />
    </DemoShell>
  );
}
