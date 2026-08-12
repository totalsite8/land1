import type { Metadata } from "next";
import DemoShell from "../../../components/demo/DemoShell";
import QueueDemo from "../../../components/demo/QueueDemo";
import { forumleadConfig } from "../../../components/demo/queues";

export const metadata: Metadata = {
  title: "ForumLead — попробовать демо. Вопросы клиентов из чатов в подборку",
  description: "Вопросы по вашей теме из районных чатов и форумов — одной подборкой на день. Добавьте вопрос и проведите его до ответа. Демо работает в браузере."
};

export default function Page() {
  return (
    <DemoShell
      id="forumlead"
      name="ForumLead"
      tag="04 / ЛИДЫ ИЗ ЧАТОВ"
      title={<>Клиенты уже спрашивают. <em>Видно, кто ответил.</em></>}
      lead="В районных чатах каждый день спрашивают «кто делает?» — и отвечает обычно конкурент. Подборка собирает такие вопросы в одну ленту; ваша работа — только ответить."
    >
      <QueueDemo config={forumleadConfig} />
    </DemoShell>
  );
}
