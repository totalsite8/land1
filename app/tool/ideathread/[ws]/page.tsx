import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DemoShell from "../../../../components/demo/DemoShell";
import DraftsWork from "../../../../components/work/DraftsWork";
import { isValidWs } from "../../../../lib/store";

export const metadata: Metadata = {
  title: "IdeaThread — рабочая версия. Общая редакция черновиков",
  robots: { index: false, follow: false }
};

export default async function Page({ params }: { params: Promise<{ ws: string }> }) {
  const { ws } = await params;
  if (!isValidWs(ws)) notFound();
  return (
    <DemoShell
      mode="work"
      id="ideathread"
      name="IdeaThread"
      tag="15 / КОНТЕНТ"
      title={<>Мысль надиктована. <em>Цепочка общая.</em></>}
      lead="Редакция общая: мысли и статусы черновиков на одной доске. Согласующий двигает статусы — автор видит результат без переспросов в чате."
    >
      <DraftsWork ws={ws} />
    </DemoShell>
  );
}
