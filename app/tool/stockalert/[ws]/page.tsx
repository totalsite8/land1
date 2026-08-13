import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DemoShell from "../../../../components/demo/DemoShell";
import { StockAlertWork } from "../../../../components/work/ThresholdWork";
import { isValidWs } from "../../../../lib/store";

export const metadata: Metadata = {
  title: "StockAlert — рабочая версия. Общий сигнал о дефиците",
  robots: { index: false, follow: false }
};

export default async function Page({ params }: { params: Promise<{ ws: string }> }) {
  const { ws } = await params;
  if (!isValidWs(ws)) notFound();
  return (
    <DemoShell
      mode="work"
      id="stockalert"
      name="StockAlert"
      tag="13 / ОСТАТКИ"
      title={<>Дефицит виден <em>за дни, а не в пик продаж.</em></>}
      lead="Остатки и темп продаж общие: зал вносит цифры, закупщик видит список закупки на той же доске — сигнал приходит до нуля, а не в пятницу вечером."
    >
      <StockAlertWork ws={ws} />
    </DemoShell>
  );
}
