"use client";

import { useEffect, useState } from "react";
import { ArrowDownRight, Trash2 } from "lucide-react";

type Comp = { id: string; name: string };
type Change = { id: string; compId: string; type: "price" | "service" | "promo" | "term"; text: string; createdAt: number };

const KEY = "demo-rivalmap";
const m = 1000 * 60;
const typeLabels: Record<Change["type"], string> = { price: "Цены", service: "Услуга", promo: "Акция", term: "Условия" };

const seedComps: Comp[] = [
  { id: "c1", name: "Студия «Барельеф»" },
  { id: "c2", name: "«МастерПласт»" }
];
const seedChanges: Change[] = [
  { id: "ch-1", compId: "c1", type: "price", text: "Подняли прайс на вывески ~12% — в прайсе на сайте новые цифры за август", createdAt: Date.now() - 2 * 24 * 60 * m },
  { id: "ch-2", compId: "c2", type: "promo", text: "Запустили «монтаж в подарок» при заказе от 150 тыс. — баннер на главной", createdAt: Date.now() - 26 * 60 * m },
  { id: "ch-3", compId: "c1", type: "service", text: "Добавили световые короба в линейку — раньше только буквы", createdAt: Date.now() - 5 * 24 * 60 * m }
];

function dateLabel(ts: number) {
  return new Date(ts).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" });
}

export default function RivalLogDemo() {
  const [comps, setComps] = useState<Comp[]>([]);
  const [changes, setChanges] = useState<Change[]>([]);
  const [compId, setCompId] = useState("c1");
  const [type, setType] = useState<Change["type"]>("price");
  const [text, setText] = useState("");
  const [newComp, setNewComp] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { comps?: Comp[]; changes?: Change[] };
        if (saved.comps && saved.comps.length) { setComps(saved.comps); setCompId(saved.comps[0].id); } else setComps(seedComps);
        if (saved.changes) setChanges(saved.changes); else setChanges(seedChanges);
        setReady(true); return;
      }
    } catch { /* повреждённое хранилище */ }
    setComps(seedComps);
    setChanges(seedChanges);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify({ comps, changes })); } catch { /* приватный режим */ }
  }, [comps, changes, ready]);

  function addComp() {
    const name = newComp.trim();
    if (!name || comps.length >= 7) return;
    const id = `c-${Date.now()}`;
    setComps((list) => [...list, { id, name }]);
    setCompId(id);
    setNewComp("");
  }

  function addChange() {
    const value = text.trim();
    if (!value || !comps.length) return;
    setChanges((list) => [{ id: `ch-${Date.now()}`, compId, type, text: value, createdAt: Date.now() }, ...list]);
    setText("");
  }

  const compName = (id: string) => comps.find((c) => c.id === id)?.name ?? "—";
  const weekAgo = Date.now() - 7 * 24 * 60 * m;
  const week = changes.filter((c) => c.createdAt >= weekAgo);
  const byType = (Object.keys(typeLabels) as Change["type"][]).map((t) => `${typeLabels[t].toLowerCase()}: ${week.filter((c) => c.type === t).length}`).join(" · ");
  const visible = changes.filter((c) => filter === "all" || c.compId === filter);

  return (
    <section className="demoApp">
      <div className="demoForm">
        <p className="demoFormTitle">Наблюдаемые конкуренты ({comps.length} из 7)</p>
        <div className="demoKinds">
          {comps.map((c) => <button key={c.id} type="button" className={compId === c.id ? "on" : ""} onClick={() => setCompId(c.id)}>{c.name}</button>)}
        </div>
        <form className="demoAddComp" onSubmit={(event) => { event.preventDefault(); addComp(); }}>
          <input value={newComp} onChange={(event) => setNewComp(event.target.value)} placeholder="Добавить конкурента — название" maxLength={60} />
          <button className="demoGhostBtn" type="submit">Добавить</button>
        </form>
        <hr className="demoSep" />
        <p className="demoFormTitle sub">Зафиксировать изменение</p>
        <div className="demoKinds">
          {(Object.keys(typeLabels) as Change["type"][]).map((t) => (
            <button key={t} type="button" className={type === t ? "on" : ""} onClick={() => setType(t)}>{typeLabels[t]}</button>
          ))}
        </div>
        <label>Что изменилось<textarea rows={3} value={text} onChange={(event) => setText(event.target.value)} placeholder="Факт и источник: что, где и как заметили" /></label>
        <button className="button demoBtn" type="button" onClick={addChange}>Внести в сводку <ArrowDownRight size={16} /></button>
        <p className="demoFootNote">В рабочей версии это публичные изменения сайтов и анонсов, сверяемые раз в неделю. Демо учит читать картину: записи превращаются в сводку сами.</p>
      </div>

      <div className="demoList">
        <div className="demoListHead">
          <p>Сводка за 7 дней — {byType}</p>
          {changes.length > 0 && <button type="button" className="demoGhostBtn" onClick={() => { setComps(seedComps); setChanges(seedChanges); setCompId("c1"); }}>Сбросить к примеру</button>}
        </div>
        <div className="demoKinds demoFilter">
          <button type="button" className={filter === "all" ? "on" : ""} onClick={() => setFilter("all")}>Все</button>
          {comps.map((c) => <button key={c.id} type="button" className={filter === c.id ? "on" : ""} onClick={() => setFilter(c.id)}>{c.name}</button>)}
        </div>
        {!ready ? null : visible.length === 0
          ? <div className="demoEmpty">По этому конкуренту записей нет — тишина тоже данные: значит, неделю он держал курс.</div>
          : visible.map((change) => (
            <article className="demoCard" key={change.id}>
              <div className="demoCardTop">
                <span className="demoKind k-task">{compName(change.compId)}</span>
                <span className={`demoStatus ${change.type === "price" ? "s-new" : change.type === "promo" ? "s-progress" : "s-done"}`}>{typeLabels[change.type].toUpperCase()}</span>
                <span className="demoTime">{dateLabel(change.createdAt)}</span>
                <button type="button" className="demoKill" onClick={() => setChanges((list) => list.filter((c) => c.id !== change.id))} aria-label="Удалить запись"><Trash2 size={14} /></button>
              </div>
              <p className="demoNeed">{change.text}</p>
            </article>
          ))}
      </div>
    </section>
  );
}
