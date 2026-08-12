import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";
import { ReactNode } from "react";

type Props = {
  id: string;
  name: string;
  tag: string;
  title: ReactNode;
  lead: string;
  children: ReactNode;
};

export default function DemoShell({ id, name, tag, title, lead, children }: Props) {
  return (
    <div className="demoBody">
      <header className="demoTop">
        <Link className="demoBack" href={`/#${id}`}><ArrowUpLeft size={14} /> К разбору на сайте</Link>
        <span className="demoBadge">ДЕМО · НИЧЕГО НЕ ОТПРАВЛЯЕТСЯ</span>
      </header>
      <section className="demoHero">
        <p className="demoTag">{tag} · {name}</p>
        <h1>{title}</h1>
        <p className="demoLead">{lead}</p>
      </section>
      {children}
      <footer className="demoFoot">
        <p>Это демо: всё введённое сохраняется только в вашем браузере и никуда не отправляется. Хотите такой инструмент в свою компанию — <Link href="/#form">оставьте заявку на пилот</Link>, и мы разберём ваш процесс.</p>
      </footer>
    </div>
  );
}
