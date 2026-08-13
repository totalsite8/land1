import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DemoShell from "../../../../components/demo/DemoShell";
import TenderFitWork from "../../../../components/work/TenderFitWork";
import { isValidWs } from "../../../../lib/store";

export const metadata: Metadata = {
  title: "TenderFit — рабочая версия. Общий фильтр закупок",
  robots: { index: false, follow: false }
};

export default async function Page({ params }: { params: Promise<{ ws: string }> }) {
  const { ws } = await params;
  if (!isValidWs(ws)) notFound();
  return (
    <DemoShell
      mode="work"
      id="tenderfit"
      name="TenderFit"
      tag="07 / ТЕНДЕРЫ"
      title={<>В ленте сотни закупок. <em>На столе — общие критерии.</em></>}
      lead="Фильтр и отметки общие: тип работ, регион и бюджет задаются один раз — отбор виден всей команде, а «не наше» не всплывёт ни у кого по ссылке."
    >
      <TenderFitWork ws={ws} />
    </DemoShell>
  );
}
