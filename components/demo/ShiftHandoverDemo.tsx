"use client";

import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Check, Trash2 } from "lucide-react";

type Note = {
  id: string;
  kind: "task" | "stock" | "issue";
  text: string;
  done: boolean;
  createdAt: number;
};

const KEY = "demo-shifthandover";
const kindLabels: Record<Note["kind"], string> = { task: "Задача", stock: "Остатки", issue: "Инцидент" };
const kindHints: Record<Note["kind"], string> = {
  task: "Что не успели закрыть — клиент, заказ, возврат",
  stock: "Остатки: чего нет, чего заказать, что списать",
  issue: "Конфликт, поломка, жалоба — что болит"
};

const seed: Note[] = [
  { id: "s-1", kind: "issue", text: "Клиент с чека 1842 ругался на вчерашнюю пиццу — обещали звонок управляющего до 12:00", done: false, createdAt: Date.now() - 1000 * 60 * 68 },
  { id: "s-2", kind: "task", text: "Заказ на 40 обедов в офис «Север» — собран, курьер заберёт в 9:30", done: false, createdAt: Date.now() - 1000 * 60 * 35 },
  { id: "s-3", kind: "stock", text: "Закончились коробки L и салфетки; молоко заказано, приедет завтра", done: true, createdAt: Date.now() - 1000 * 60 * 20 }
];

function timeLabel(ts: number) {
  return new Date(ts).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

export default function ShiftHandoverDemo() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [kind, setKind] = useState<Note["kind"]>("task");
  const [text, setText] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) { setNotes(JSON.parse(raw) as Note[]); setReady(true); return; }
    } catch { /* повреждённое хранилище — идём с сидами */ }
    setNotes(seed);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(notes)); } catch { /* приватный режим */ }
  }, [notes, ready]);

  function addNote() {
    const value = text.trim();
    if (!value) return;
    setNotes((list) => [{ id: `n-${Date.now()}`, kind, text: value, done: false, createdAt: Date.now() }, ...list]);
    setText("");
  }

  function toggle(id: string) { setNotes((list) => list.map((note) => note.id === id ? { ...note, done: !note.done } : note)); }
  function remove(id: string) { setNotes((list) => list.filter((note) => note.id !== id)); }

  const openCount = notes.filter((note) => !note.done).length;

  return (
    <section className="demoApp">
      <form className="demoForm" onSubmit={(event) => { event.preventDefault(); addNote(); }}>
        <p className="demoFormTitle">Что смена оставляет после себя</p>
        <div className="demoKinds" role="tablist" aria-label="Тип записи">
          {(["task", "stock", "issue"] as const).map((item) => (
            <button key={item} type="button" role="tab" aria-selected={kind === item} className={kind === item ? "on" : ""} onClick={() => setKind(item)}>{kindLabels[item]}</button>
          ))}
        </div>
        <label>{kindHints[kind]}<textarea rows={3} value={text} onChange={(event) => setText(event.target.value)} placeholder="Одна запись — одна вещь. Коротко и по делу." /></label>
        <button className="button demoBtn" type="submit">Поставить на доску <ArrowDownRight size={16} /></button>
        <p className="demoFootNote">Перед уходом смена снимает всё из головы на доску. Утренняя читает доску, а не листает чат.</p>
      </form>

      <div className="demoList">
        <div className="demoListHead">
          <p>Доска передачи — открыто {openCount} из {notes.length}</p>
          {notes.length > 0 && <button type="button" className="demoGhostBtn" onClick={() => setNotes(seed)}>Сбросить к примеру</button>}
        </div>
        {notes.length === 0 && <div className="demoEmpty">Доска пуста — смена закрыла всё (или ещё ничего не передала).</div>}
        {notes.map((note) => (
          <article className={`demoCard shiftCard${note.done ? " closed" : ""}`} key={note.id}>
            <div className="demoCardTop">
              <span className={`demoKind k-${note.kind}`}>{kindLabels[note.kind]}</span>
              <span className="demoTime">{timeLabel(note.createdAt)}</span>
              <button type="button" className="demoKill" onClick={() => remove(note.id)} aria-label="Удалить запись"><Trash2 size={14} /></button>
            </div>
            <p className="demoNeed">{note.text}</p>
            <button type="button" className="demoGhostBtn demoCardCta" onClick={() => toggle(note.id)}>
              {note.done ? <><Check size={13} /> Принято следующей сменой — вернуть в открытые</> : <>Отметить принятой <ArrowUpRight size={13} /></>}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
