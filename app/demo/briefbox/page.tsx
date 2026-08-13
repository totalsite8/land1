import type { Metadata } from "next";
import DemoShell from "../../../components/demo/DemoShell";
import BriefBoxDemo from "../../../components/demo/BriefBoxDemo";
import WorkBanner from "../../../components/work/WorkBanner";

export const metadata: Metadata = {
  title: "BriefBox — попробовать демо. Заявка одной карточкой",
  description: "Соберите заявку из звонка, чата и голосового в одну карточку: суть, срок, контекст, контакт. Демо работает в вашем браузере, ничего не отправляется."
};

export default function Page() {
  return (
    <DemoShell
      id="briefbox"
      name="BriefBox"
      tag="01 / ЗАЯВКИ"
      title={<>Заявка без квеста. <em>Всё — в одной карточке.</em></>}
      lead="Слева — то, что менеджер обычно собирает по памяти из трёх чатов. Справа — список, где каждая заявка видна целиком и никуда не теряется. Попробуйте: это та же рука, только всё на месте."
    >
      <WorkBanner tool="briefbox" toolName="BriefBox" />
      <BriefBoxDemo />
    </DemoShell>
  );
}
