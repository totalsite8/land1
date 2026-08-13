import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DemoShell from "../../../../components/demo/DemoShell";
import { PriceSignalWork } from "../../../../components/work/ThresholdWork";
import { isValidWs } from "../../../../lib/store";

export const metadata: Metadata = {
  title: "PriceSignal — рабочая версия. Общий сигнал о марже",
  robots: { index: false, follow: false }
};

export default async function Page({ params }: { params: Promise<{ ws: string }> }) {
  const { ws } = await params;
  if (!isValidWs(ws)) notFound();
  return (
    <DemoShell
      mode="work"
      id="pricesignal"
      name="PriceSignal"
      tag="08 / ЦЕНЫ"
      title={<>Издержки выросли тихо. <em>Сигнал виден всем.</em></>}
      lead="Позиции и порог общие: закупщик правит себестоимость, владелец видит сигнал о марже — одна доска и одни цифры у всех по ссылке."
    >
      <PriceSignalWork ws={ws} />
    </DemoShell>
  );
}
