"use client";

import { useState } from "react";
import { ArrowDownRight, ArrowUpRight, Check, Trash2 } from "lucide-react";
import useWork from "./useWork";
import { WorkStateBox } from "./workUi";

type NoteData = { kind: "task" | "stock" | "issue"; text: string; done: boolean };

const kindLabels: Record<NoteData["kind"], string> = { task: "Задача", stock: "Остатки", issue: "Инцидент" };
const kindHints: Record<NoteData["kind"], string> = {
  task: "Что не успели закрыть — клиент, заказ, возврат",
  stock: "Остатки: чего нет, чего заказать, что списать",
  issue: "Конфликт, поломка, жалоба — что болит"
};

export default function ShiftHandoverWork({ ws }: { ws: string }) {
  const { items, state, create, patch, remove, reload } = useWork<NoteData>(ws);
  const [kind, setKind] = useState<NoteData["kind"]>("task");
  const [text, setText] = useState("");
  const [loud, setLoud] = useState("");

  async function add() {
    const value = text.trim();
    if (!value) return;
    setLoud("");
    const ok = await create({ kind, text: value.slice(0, 900), done: false });
    if (ok) setText("");
    else setLoud("Не сохранилось — проверьте связь и попробуйте ещё раз.");
  }

  const openCount = items.filter((item) => !item.data.done).length;

  return (
    <section className="demoApp">
      <form className="demoForm" onSubmit={(event) => { event.preventDefault(); void add(); }}>
        <p className="demoFormTitle">Что смена оставляет после себя</p>
        <div className="demoKinds" role="tablist" aria-label="Тип записи">
          {(["task", "stock", "issue"] as const).map((item) => (
            <button key={item} type="button" role="tab" aria-selected={kind === item} className={kind === item ? "on" : ""} onClick={() => setKind(item)}>{kindLabels[item]}</button>
          ))}
        </div>
        <label>{kindHints[kind]}<textarea rows={3} value={text} onChange={(event) => setText(event.target.value)} placeholder="Одна запись — одна вещь. Коротко и по делу." /></label>
        <button className="button demoBtn" type="submit">Поставить на доску смен <ArrowDownRight size={16} /></button>
        {loud ? <p className="formError">{loud}</p> : null}
        <p className="demoFootNote">Доска общая: вечерняя смена оставляет, утренняя открывает на своём телефоне и отмечает принятое. Обновление — раз в 15 секунд.</p>
      </form>

      <div className="demoList">
        <div className="demoListHead">
          <p>Доска передачи — открыто {openCount} из {items.length} · обновление каждые 15 сек</p>
        </div>
        <WorkStateBox state={state} onRetry={() => void reload()} />
        {state === "ok" && items.length === 0 ? <div className="demoEmpty">Доска пуста — смена закрыла всё, или ещё никто ничего не передал.</div> : null}
        {state === "ok" && items.map((item) => (
          <article className={`demoCard shiftCard${item.data.done ? " closed" : ""}`} key={item.id}>
            <div className="demoCardTop">
              <span className={`demoKind k-${item.data.kind}`}>{kindLabels[item.data.kind]}</span>
              <span className="demoTime">{new Date(item.createdAt).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</span>
              <button type="button" className="demoKill" onClick={() => void remove(item.id)} aria-label="Удалить запись"><Trash2 size={14} /></button>
            </div>
            <p className="demoNeed">{item.data.text}</p>
            <button type="button" className="demoGhostBtn demoCardCta" onClick={() => void patch(item.id, { ...item.data, done: !item.data.done })}>
              {item.data.done ? <><Check size={13} /> Принято следующей сменой — вернуть в открытые</> : <>Отметить принятой <ArrowUpRight size={13} /></>}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
