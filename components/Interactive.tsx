"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

/* ---------- Появление блоков при прокрутке ---------- */
export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) { setOn(true); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) { setOn(true); io.disconnect(); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`rv ${on ? "on" : ""} ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>{children}</div>;
}

/* ---------- 01 / Диагноз: раскрывающиеся карточки ---------- */
const scenes = [
  {
    quote: "«Где была эта заявка?»",
    text: "Клиент написал, менеджер ответил в личке, детали остались в голосовом — к вечеру никто не помнит, что обещали.",
    more: "Клиент ждёт то, что ему наобещали голосом. Менеджер переспрашивает — и раздражает. Пока собирают концы по трем чатам, заявка остывает и уходит тому, кто ответил целиком и сразу.",
    link: "#briefbox",
    linkLabel: "Какой узел это распутывает: BriefBox"
  },
  {
    quote: "«Кто объяснит это новенькому?»",
    text: "Сотрудник ушёл, инструкция ушла вместе с ним. Следующий человек снова учится на ошибках.",
    more: "Коллеги отвечают на одни и те же вопросы вместо работы. Новичок стесняется спрашивать — и повторяет ошибки предшественника. Через месяц он знает ровно столько, сколько успел подслушать.",
    link: "#onboardone",
    linkLabel: "Какой узел это распутывает: OnboardOne"
  },
  {
    quote: "«А смене вообще передали?»",
    text: "Незакрытая задача, остаток, конфликт с клиентом — всё существует, пока о нём не узнают слишком поздно.",
    more: "Утренняя смена узнаёт о конфликте от недовольного клиента — когда исправлять уже дороже. Каждый день начинается с расследования вчерашнего, а не с работы.",
    link: "#shifthandover",
    linkLabel: "Какой узел это распутывает: ShiftHandover"
  }
];

export function DiagnosisCards() {
  const [open, setOpen] = useState<number | null>(null);
  return <div className="sceneGrid">
    {scenes.map((scene, index) => <Reveal key={scene.quote} delay={index * 100}>
      <article className={open === index ? "open" : ""}>
        <b>{scene.quote}</b>
        <p>{scene.text}</p>
        <div className="sceneMore" aria-hidden={open !== index}>
          <p>{scene.more}</p>
          <a href={scene.link}>{scene.linkLabel} <ArrowDownRight size={13} /></a>
        </div>
        <button type="button" className="sceneToggle" onClick={() => setOpen(open === index ? null : index)} aria-expanded={open === index}>
          {open === index ? "— Скрыть" : "+ Чем это кончается"}
        </button>
      </article>
    </Reveal>)}
  </div>;
}

/* ---------- 05 / Процесс: интерактивные шаги ---------- */
const processSteps = [
  {
    title: "Вы описываете одну боль",
    text: "Не «нужна автоматизация», а «заявка теряется между Telegram и менеджером». Достаточно пяти предложений и одного живого примера из этой недели.",
    meta: "ОТ ВАС — 5 МИНУТ НА ФОРМУ"
  },
  {
    title: "Мы отвечаем в течение дня",
    text: "Уточняем, где процесс ломается, кто в нём участвует и какой результат нужен. Если вопросов много — короткий созвон только по вашему процессу, без презентаций.",
    meta: "ОТ НАС — ВОПРОСЫ ПО СУТИ"
  },
  {
    title: "Собираем сценарий пилота",
    text: "Вы видите, что будет проверяться, какие данные понадобятся и что сознательно не входит в первую версию. Никаких «потом разберёмся» на старте.",
    meta: "ОТ НАС — ЧЕРНОВИК СЦЕНАРИЯ"
  },
  {
    title: "Берём приоритетные запросы в работу",
    text: "Без обещаний, которые нельзя выполнить: сначала условия, потом сроки. Если узел не распутывается маленьким инструментом — скажем об этом прямо.",
    meta: "ЧЕСТНО, ДАЖЕ ЕСЛИ БЕЗ НАС"
  }
];

export function ProcessSteps() {
  const [active, setActive] = useState(0);
  return <ol className="processSteps">
    {processSteps.map((step, index) => <Reveal key={step.title} delay={index * 80}>
      <li className={active === index ? "active" : ""} onMouseEnter={() => setActive(index)} onClick={() => setActive(index)}>
        <span>{index + 1}</span>
        <b>{step.title}</b>
        <p>{step.text}</p>
        <em className="stepMeta">{step.meta}</em>
      </li>
    </Reveal>)}
  </ol>;
}

/* ---------- Кнопка «Это моя боль»: подставляет заготовку в форму ---------- */
export function CasePrefill({ name }: { name: string }) {
  const [done, setDone] = useState(false);
  const timer = useRef<number | null>(null);
  useEffect(() => () => { if (timer.current !== null) window.clearTimeout(timer.current); }, []);
  function go() {
    const text = `Смотрю пилот «${name}». Похоже на нашу ситуацию: `;
    window.dispatchEvent(new CustomEvent("prefill-problem", { detail: { text } }));
    document.getElementById("form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    setDone(true);
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setDone(false), 2600);
  }
  return <button type="button" className={`prefillBtn ${done ? "done" : ""}`} onClick={go}>
    {done ? <>Подставили — форма ждёт ниже <ArrowDownRight size={15} /></> : <>Это моя боль — подставить в форму <ArrowUpRight size={15} /></>}
  </button>;
}
