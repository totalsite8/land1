import type { Metadata } from "next";
import DemoShell from "../../../components/demo/DemoShell";
import QueueDemo from "../../../components/demo/QueueDemo";
import { docchaserConfig } from "../../../components/demo/queues";

export const metadata: Metadata = {
  title: "DocChaser — попробовать демо. Доска документов в работе",
  description: "Акты и счета со статусами и ответственными: видно, где что висит и что просрочено. Демо работает в браузере."
};

export default function Page() {
  return (
    <DemoShell
      id="docchaser"
      name="DocChaser"
      tag="10 / ДОКУМЕНТЫ"
      title={<>Конец поискам «где акт». <em>Он на доске.</em></>}
      lead="Каждый документ — с ответственным, сроком и честным статусом. Просроченные подсвечиваются сами: спрятаться за «я думал, ты» больше не выйдет."
    >
      <QueueDemo config={docchaserConfig} />
    </DemoShell>
  );
}
