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
  const [closing, setClosing] = useState(false); // панель доигрывает анимацию закрытия
  const [mobile, setMobile] = useState(false); // полноэкранное меню
  const rootRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<number | null>(null); // пауза «не захлопывать сразу»
  const animTimer = useRef<number | null>(null);  // доигрывание анимации закрытия

  function clearTimers() {
    if (closeTimer.current) { window.clearTimeout(closeTimer.current); closeTimer.current = null; }
    if (animTimer.current) { window.clearTimeout(animTimer.current); animTimer.current = null; }
  }

  /** Открыть панель (или переключиться на другую) — мгновенно, без мерцания. */
  function openPanel(index: number) {
    clearTimers();
    setClosing(false);
    setOpen(index);
  }

  /** Курсор вернулся в шапку или на панель: закрытие отменяется. */
  function keepOpen() {
    if (closeTimer.current) { window.clearTimeout(closeTimer.current); closeTimer.current = null; }
    if (animTimer.current) { window.clearTimeout(animTimer.current); animTimer.current = null; }
    if (closing) setClosing(false);
  }

  /**
   * Закрытие: сначала терпимая пауза (курсор успевает пересечь зазор и вернуться),
   * затем мягкая анимация сворачивания, и только после неё размонтирование.
   */
  function requestClose(immediate = false) {
    if (open < 0 && !closing) return;
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      closeTimer.current = null;
      setClosing(true);
      animTimer.current = window.setTimeout(() => {
        animTimer.current = null;
        setOpen(-1);
        setClosing(false);
      }, 170);
    }, immediate ? 0 : 300);
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) { if (event.key === "Escape") { requestClose(true); setMobile(false); } }
    function onDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) requestClose(true);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("pointerdown", onDown); clearTimers(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobile]);

  const closeAll = () => { clearTimers(); setOpen(-1); setClosing(false); setMobile(false); };

  /** Закрыть меню, если фокус клавиатуры ушёл из шапки и курсора над ней нет. */
  function onFocusGone() {
    window.setTimeout(() => {
      if (rootRef.current && !rootRef.current.contains(document.activeElement) && !rootRef.current.matches(":hover")) requestClose(true);
    }, 0);
  }

  const toolLink = (tool: (typeof microSaas)[number]) => (
    <a className="mmLink mmTool" href={`#${tool.id}`} key={tool.id} onClick={closeAll}>
      <span className="mmNo">{tool.num}</span>
      <span><b>{tool.name}</b><small>{tool.core ? tool.short?.title : tool.painShort}</small></span>
    </a>
  );

  return (
    <>
      <header
        className={mobile ? "top open" : "top"}
        ref={rootRef}
        onMouseLeave={() => requestClose()}
        onMouseEnter={() => { if (open >= 0 || closing) keepOpen(); }}
        onFocusCapture={() => { if (open >= 0 || closing) keepOpen(); }}
        onBlurCapture={onFocusGone}
      >
        <a className="brand" href="#top">ЭЙ АЙ, <em>БОЛЬНО</em></a>
        <nav className="mmNav" aria-label="Навигация по сайту">
          <div className="mmTriggers">
            {triggers.map((label, index) => (
              <button
                key={label}
                type="button"
                className="mmTrig"
                aria-expanded={open === index}
                onMouseEnter={() => openPanel(index)}
                onClick={() => (open === index ? requestClose(true) : openPanel(index))}
              >{label} <ChevronDown size={12} /></button>
            ))}
          </div>
          <a className="topRightTg" href="https://t.me/bloodaman" target="_blank" rel="noreferrer">TELEGRAM ↗</a>
          <button type="button" className={`burger${mobile ? " on" : ""}`} aria-label="Открыть меню" aria-expanded={mobile} onClick={() => setMobile(!mobile)}><span /><span /><span /></button>
        </nav>

        {open === 0 && <div className={`mmPanel${closing ? " closing" : ""}`} onMouseEnter={keepOpen}>
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

        {open === 1 && <div className={`mmPanel mmPanelTools${closing ? " closing" : ""}`} onMouseEnter={keepOpen}>
          <p className="mmGroupH">Первые в очереди на разработку</p>
          <div className="mmGrid mmGridTools">{core.map(toolLink)}</div>
          <p className="mmGroupH">Проверяем спрос — ваша заявка двигает очередь</p>
          <div className="mmGrid mmGridTools">{queue.map(toolLink)}</div>
          <div className="mmFoot"><a className="buttonGhost" style={{ marginLeft: 0 }} href="#details" onClick={closeAll}>Весь каталог в деталях <ArrowDownRight size={16} /></a><p className="mmNote">Нажмите на инструмент — откроется его разбор: ситуация, боль, пилот, шаги.</p></div>
          <p className="mmDemo"><b>Живые демо всех 15:</b> {microSaas.map((tool, index) => <span key={tool.id}>{index > 0 ? " · " : ""}<a href={`/demo/${tool.id}`} onClick={closeAll}>{tool.name}</a></span>)}</p>
        </div>}

        {open === 2 && <div className={`mmPanel${closing ? " closing" : ""}`} onMouseEnter={keepOpen}>
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
        <p className="mmDemo"><b>Живые демо всех 15:</b> {microSaas.map((tool, index) => <span key={tool.id}>{index > 0 ? " · " : ""}<a href={`/demo/${tool.id}`} onClick={closeAll}>{tool.name}</a></span>)}</p>
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
