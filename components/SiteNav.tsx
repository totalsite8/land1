"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDownRight, ArrowUpRight, ChevronDown, Phone, Sparkles } from "lucide-react";
import { microSaas } from "./microSaas";

const sections = [
  { no: "01", name: "Диагноз", hint: "Из чего копится хаос", href: "#diagnosis" },
  { no: "02", name: "Первые узлы", hint: "Три боли — в очереди на разработку", href: "#solutions" },
  { no: "03", name: "В работе", hint: "Двенадцать болей ждут заявок", href: "#catalogue" },
  { no: "04", name: "Каталог в деталях", hint: "Ситуация, боль, план пилота, три шага", href: "#details" },
  { no: "05", name: "Как мы работаем", hint: "Четыре шага, без магии", href: "#process" },
  { no: "06", name: "Форма", hint: "Одна операция и один пример — хватит пяти предложений", href: "#form" },
  { no: "07", name: "Вопросы", hint: "Честные ответы, без мелкого шрифта", href: "#faq" }
] as const;

const triggers = ["Разделы", "Каталог · 15", "Связаться"] as const;

const core = microSaas.filter((tool) => tool.core);
const queue = microSaas.filter((tool) => !tool.core);

export default function SiteNav() {
  const [open, setOpen] = useState(-1);       // -1 закрыто, 0..2 — панель на ПК
  const [mobile, setMobile] = useState(false); // полноэкранное меню
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function onKey(event: KeyboardEvent) { if (event.key === "Escape") { setOpen(-1); setMobile(false); } }
    function onDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(-1);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("pointerdown", onDown); };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobile]);

  const closeAll = () => { setOpen(-1); setMobile(false); };

  const toolLink = (tool: (typeof microSaas)[number]) => (
    <a className="mmLink mmTool" href={`#${tool.id}`} key={tool.id} onClick={closeAll}>
      <span className="mmNo">{tool.num}</span>
      <span><b>{tool.name}</b><small>{tool.core ? tool.short?.title : tool.painShort}</small></span>
    </a>
  );

  return (
    <>
      <header className={mobile ? "top open" : "top"} ref={rootRef} onMouseLeave={() => setOpen(-1)}>
        <a className="brand" href="#top">ЭЙ АЙ, <em>БОЛЬНО</em></a>
        <nav className="mmNav" aria-label="Навигация по сайту">
          <div className="mmTriggers">
            {triggers.map((label, index) => (
              <button
                key={label}
                type="button"
                className="mmTrig"
                aria-expanded={open === index}
                onMouseEnter={() => setOpen(index)}
                onClick={() => setOpen(open === index ? -1 : index)}
              >{label} <ChevronDown size={12} /></button>
            ))}
          </div>
          <a className="topRightTg" href="https://t.me/bloodaman" target="_blank" rel="noreferrer">TELEGRAM ↗</a>
          <button type="button" className={`burger${mobile ? " on" : ""}`} aria-label="Открыть меню" aria-expanded={mobile} onClick={() => setMobile(!mobile)}><span /><span /><span /></button>
        </nav>

        {open === 0 && <div className="mmPanel" onMouseEnter={() => setOpen(0)}>
          <div className="mmGrid">
            {sections.map((item) => (
              <a className="mmLink" href={item.href} key={item.no} onClick={closeAll}>
                <span className="mmNo">{item.no}</span>
                <span><b>{item.name}</b><small>{item.hint}</small></span>
              </a>
            ))}
          </div>
          <div className="mmFoot"><a className="button" href="#form" data-mag onClick={closeAll}>Описать боль <ArrowDownRight size={16} /></a><p className="mmNote">Одна операция за раз — ответим в течение дня.</p></div>
        </div>}

        {open === 1 && <div className="mmPanel mmPanelTools" onMouseEnter={() => setOpen(1)}>
          <p className="mmGroupH">Первые в очереди на разработку</p>
          <div className="mmGrid mmGridTools">{core.map(toolLink)}</div>
          <p className="mmGroupH">Проверяем спрос — ваша заявка двигает очередь</p>
          <div className="mmGrid mmGridTools">{queue.map(toolLink)}</div>
          <div className="mmFoot"><a className="buttonGhost" style={{ marginLeft: 0 }} href="#details" onClick={closeAll}>Весь каталог в деталях <ArrowDownRight size={16} /></a><p className="mmNote">Нажмите на инструмент — откроется его разбор: ситуация, боль, пилот, шаги.</p></div>
          <p className="mmDemo">Живые демо уже работают: <a href="/demo/briefbox" onClick={closeAll}>BriefBox</a> · <a href="/demo/onboardone" onClick={closeAll}>OnboardOne</a> · <a href="/demo/shifthandover" onClick={closeAll}>ShiftHandover</a></p>
        </div>}

        {open === 2 && <div className="mmPanel" onMouseEnter={() => setOpen(2)}>
          <div className="mmContacts">
            <div className="mmC"><p className="mmGroupH" style={{ margin: "0 0 4px" }}>Позвонить</p><a className="mmBig" href="tel:+79037275131" onClick={closeAll}><Phone size={18} /> +7 903 727-51-31</a><small>Если удобнее голосом — расскажите про процесс, мы зададим вопросы.</small></div>
            <div className="mmC"><p className="mmGroupH" style={{ margin: "0 0 4px" }}>Написать</p><a className="mmBig" href="https://t.me/bloodaman" target="_blank" rel="noreferrer"><Sparkles size={18} /> @bloodaman</a><small>Telegram — самый быстрый канал. Отвечаем в течение дня.</small></div>
            <div className="mmC"><p className="mmGroupH" style={{ margin: "0 0 4px" }}>Через форму</p><a className="mmBig" href="#form" onClick={closeAll}>Описать боль <ArrowUpRight size={18} /></a><small>Пять предложений и пример — дальше вопросы уже наши.</small></div>
          </div>
          <div className="mmFoot"><p className="mmNote">Без рассылок, звонков «с предложением» и передачи контактов третьим лицам.</p></div>
        </div>}
      </header>

      {mobile && <div className="mmOverlay" role="dialog" aria-label="Меню">
        <p className="mmGroupH">Разделы</p>
        <div className="mmCol">
          {sections.map((item) => (
            <a className="mmLink mmLinkBig" href={item.href} key={item.no} onClick={closeAll}>
              <span className="mmNo">{item.no}</span>
              <span><b>{item.name}</b><small>{item.hint}</small></span>
            </a>
          ))}
        </div>
        <p className="mmGroupH">Каталог · 15</p>
        <div className="mmCol mmColTools">{microSaas.map(toolLink)}</div>
        <p className="mmDemo">Живые демо уже работают: <a href="/demo/briefbox" onClick={closeAll}>BriefBox</a> · <a href="/demo/onboardone" onClick={closeAll}>OnboardOne</a> · <a href="/demo/shifthandover" onClick={closeAll}>ShiftHandover</a></p>
        <p className="mmGroupH">Связаться</p>
        <div className="mmCol mmColContacts">
          <a className="mmBig" href="tel:+79037275131"><Phone size={18} /> +7 903 727-51-31</a>
          <a className="mmBig" href="https://t.me/bloodaman" target="_blank" rel="noreferrer"><Sparkles size={18} /> @bloodaman в Telegram</a>
        </div>
        <a className="button buttonLime mmCta" href="#form" onClick={closeAll}>Описать боль <ArrowDownRight size={18} /></a>
        <p className="mmNote" style={{ marginTop: 18 }}>Отвечаем в течение дня. Без спама и передачи контактов.</p>
      </div>}
    </>
  );
}
