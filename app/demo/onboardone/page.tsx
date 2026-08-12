import type { Metadata } from "next";
import DemoShell from "../../../components/demo/DemoShell";
import OnboardOneDemo from "../../../components/demo/OnboardOneDemo";

export const metadata: Metadata = {
  title: "OnboardOne — попробовать демо. Маршрут первых дней новичка",
  description: "Маршрут первых рабочих дней для одной роли: что сделать, у кого спросить, что проверить. Отметьте шаги — прогресс виден сразу. Демо работает в браузере, ничего не отправляется."
};

export default function Page() {
  return (
    <DemoShell
      id="onboardone"
      name="OnboardOne"
      tag="02 / ОБУЧЕНИЕ"
      title={<>Новичок не учится на слухах. <em>Он идёт по маршруту.</em></>}
      lead="Выберите роль — получите маршрут первых дней: что сделать, у кого спросить, что проверить. Отмечайте шаги, добавляйте свои. Знание остаётся в команде, даже если ушёл «тот, кто помнит»."
    >
      <OnboardOneDemo />
    </DemoShell>
  );
}
