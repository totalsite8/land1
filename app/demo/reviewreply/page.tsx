import type { Metadata } from "next";
import DemoShell from "../../../components/demo/DemoShell";
import WorkBanner from "../../../components/work/WorkBanner";
import QueueDemo from "../../../components/demo/QueueDemo";
import { reviewreplyConfig } from "../../../components/demo/queues";

export const metadata: Metadata = {
  title: "ReviewReply — попробовать демо. Одна очередь отзывов со всех площадок",
  description: "Карты, 2ГИС, отзовики — все отзывы в одной очереди, дольше всех ждущие наверху. Демо работает в браузере."
};

export default function Page() {
  return (
    <DemoShell
      id="reviewreply"
      name="ReviewReply"
      tag="09 / ОТЗЫВЫ"
      title={<>Ни один отзыв <em>не висит без ответа.</em></>}
      lead="Отзывы со всех площадок — в одной очереди с возрастом ожидания. Отвечает человек; инструмент гарантирует, что вопрос не потерялся."
    >
      <WorkBanner tool="reviewreply" toolName="ReviewReply" />
      <QueueDemo config={reviewreplyConfig} />
    </DemoShell>
  );
}
