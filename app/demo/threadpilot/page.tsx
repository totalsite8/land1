import type { Metadata } from "next";
import DemoShell from "../../../components/demo/DemoShell";
import QueueDemo from "../../../components/demo/QueueDemo";
import { threadpilotConfig } from "../../../components/demo/queues";

export const metadata: Metadata = {
  title: "ThreadPilot — попробовать демо. Открытые диалоги на одном поле",
  description: "Кто ждёт ответа, сколько времени и в каком канале — долг по диалогам на одном экране. Демо работает в браузере."
};

export default function Page() {
  return (
    <DemoShell
      id="threadpilot"
      name="ThreadPilot"
      tag="14 / ДИАЛОГИ"
      title={<>Десять чатов. <em>Одно поле долга.</em></>}
      lead="Отвечать вы продолжаете там, где привыкли — Telegram, WhatsApp, почта. Здесь живёт только остаток долга: кто ждёт и сколько уже."
    >
      <QueueDemo config={threadpilotConfig} />
    </DemoShell>
  );
}
