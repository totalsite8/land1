import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";
import { ReactNode } from "react";
import CopyLink from "../work/CopyLink";

type Props = {
  id: string;
  name: string;
  tag: string;
  title: ReactNode;
  lead: string;
  children: ReactNode;
  mode?: "demo" | "work";
};

export default function DemoShell({ id, name, tag, title, lead, children, mode = "demo" }: Props) {
  const work = mode === "work";
  return (
    <div className="demoBody">
      <header className="demoTop">
        <Link className="demoBack" href={`/#${id}`}><ArrowUpLeft size={14} /> К разбору на сайте</Link>
        <div className="demoTopRight">
          {work ? <CopyLink /> : null}
          <span className={work ? "demoBadge demoBadgeWork" : "demoBadge"}>{work ? "РАБОЧАЯ ВЕРСИЯ · ВХОД ПО ССЫЛКЕ" : "ДЕМО · НИЧЕГО НЕ ОТПРАВЛЯЕТСЯ"}</span>
        </div>
      </header>
      <section className="demoHero">
        <p className="demoTag">{tag} · {name}</p>
        <h1>{title}</h1>
        <p className="demoLead">{lead}</p>
      </section>
      {children}
      <footer className="demoFoot">
        {work
          ? <p>Пространство общее: попасть сюда можно только по этой ссылке — отсылайте её команде в рабочем чате. Хотите свой бренд, свои поля и свои роли — <Link href="/#form">опишите процесс в заявке</Link>.</p>
          : <p>Это демо: всё введённое сохраняется только в вашем браузере и никуда не отправляется. Хотите такой инструмент в свою компанию — <Link href="/#form">оставьте заявку на пилот</Link>, и мы разберём ваш процесс.</p>}
      </footer>
    </div>
  );
}
