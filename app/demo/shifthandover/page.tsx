import type { Metadata } from "next";
import DemoShell from "../../../components/demo/DemoShell";
import ShiftHandoverDemo from "../../../components/demo/ShiftHandoverDemo";

export const metadata: Metadata = {
  title: "ShiftHandover — попробовать демо. Доска передачи смены",
  description: "Задачи, остатки и инциденты уходящей смены — один видимый список, а не надежда на чат. Демо работает в браузере, ничего не отправляется."
};

export default function Page() {
  return (
    <DemoShell
      id="shifthandover"
      name="ShiftHandover"
      tag="03 / СМЕНЫ"
      title={<>Смена не заканчивается в чужой голове. <em>Она на доске.</em></>}
      lead="Перед уходом смена оставляет задачи, остатки и инциденты одним списком. Утренняя смена открывает доску — и принимает дела, а не догадки. Попробуйте оставить запись и «принять» её следующей сменой."
    >
      <ShiftHandoverDemo />
    </DemoShell>
  );
}
