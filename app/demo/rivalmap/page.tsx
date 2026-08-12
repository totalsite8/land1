import type { Metadata } from "next";
import DemoShell from "../../../components/demo/DemoShell";
import RivalLogDemo from "../../../components/demo/RivalLogDemo";

export const metadata: Metadata = {
  title: "RivalMap — попробовать демо. Сводка ходов конкурентов",
  description: "Публичные изменения конкурентов — цены, услуги, акции, условия — в одной сводке недели. Добавьте конкурента и зафиксируйте изменение. Демо работает в браузере."
};

export default function Page() {
  return (
    <DemoShell
      id="rivalmap"
      name="RivalMap"
      tag="05 / КОНКУРЕНТЫ"
      title={<>Ходы конкурентов — <em>из сводки, а не от клиента.</em></>}
      lead="Три-семь конкурентов, четыре типа изменений — цены, услуги, акции, условия. Неделя наблюдений складывается в читаемую сводку для решения."
    >
      <RivalLogDemo />
    </DemoShell>
  );
}
