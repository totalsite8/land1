import type { Metadata } from "next";
import DemoShell from "../../../components/demo/DemoShell";
import DraftsDemo from "../../../components/demo/DraftsDemo";

export const metadata: Metadata = {
  title: "IdeaThread — попробовать демо. Из мысли — цепочка черновиков",
  description: "Надиктуйте одно наблюдение — получите три черновика публикаций со статусами согласования. Демо работает в браузере."
};

export default function Page() {
  return (
    <DemoShell
      id="ideathread"
      name="IdeaThread"
      tag="15 / КОНТЕНТ"
      title={<>Мысль надиктована. <em>Цепочка готова.</em></>}
      lead="Одно наблюдение — три черновика: тезис, разбор, история. Статусы проводят каждый от черновика к очереди на публикацию."
    >
      <DraftsDemo />
    </DemoShell>
  );
}
