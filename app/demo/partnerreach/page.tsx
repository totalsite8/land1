import type { Metadata } from "next";
import DemoShell from "../../../components/demo/DemoShell";
import QueueDemo from "../../../components/demo/QueueDemo";
import { partnerreachConfig } from "../../../components/demo/queues";

export const metadata: Metadata = {
  title: "PartnerReach — попробовать демо. Договорённости с партнёрами в списке",
  description: "Партнёры, договорённости и дата следующего контакта — с напоминаниями и поводом. Демо работает в браузере."
};

export default function Page() {
  return (
    <DemoShell
      id="partnerreach"
      name="PartnerReach"
      tag="06 / ПАРТНЁРЫ"
      title={<>Договорённости не умирают. <em>Их видно.</em></>}
      lead="«Вспомню, когда увижу» — так остывает половина партнёрских каналов. Список с датой следующего контакта подсвечивает просроченные связи сам."
    >
      <QueueDemo config={partnerreachConfig} />
    </DemoShell>
  );
}
