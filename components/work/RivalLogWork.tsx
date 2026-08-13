"use client";

import { useState } from "react";
import { ArrowDownRight, Trash2 } from "lucide-react";
import useBuckets from "./useBuckets";
import { WorkStateBox } from "./workUi";

type CompRow = { key: string; name: string };
type ChangeType = "price" | "service" | "promo" | "term";
type ChangeRow = { compKey: string; type: ChangeType; text: string; createdAt: number };

const m = 1000 * 60;
const typeLabels: Record<ChangeType, string> = { price: "Цены", service: "Услуга", promo: "Акция", term: "Условия" };

function dateLabel(ts: number) {
  return new Date(ts).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" });
}

export default function RivalLogWork({ ws }: { ws: string }) {
  const { bucket, add, remove, state, reload } = useBuckets(ws);
  const [compKey, setCompKey] = useState("");
  const [type, setType] = useState<ChangeType>("price");
  const [text, setText] = useState("");
  const [newComp, setNewComp] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [loud, setLoud] = useState("");

  const comps = bucket<CompRow>("comp");
  const changes = bucket<ChangeRow>("change");
  const activeKey = comps.some((c) => c.data.key === compKey) ? compKey : (comps[0]?.data.key ?? "");

  async function addComp() {
    const value = newComp.trim();
    if (!value || comps.length >= 7) return;
    setLoud("");
    const key = `c-${Date.now()}`;
    const ok = await add("comp", { key, name: value.slice(0, 60) });
    if (ok) { setCompKey(key); setNewComp(""); }
    else setLoud("Не сохранилось — проверьте связь и попробуйте ещё раз.");
  }

  async function addChange() {
    const value = text.trim();
    if (!value || !activeKey) return;
    setLoud("");
    const ok = await add("change", { compKey: activeKey, type, text: value.slice(0, 900), createdAt: Date.now() });
    if (ok) setText("");
    else setLoud("Не сохранилось — проверьте связь и попробуйте ещё раз.");
  }

  const compName = (key: string) => comps.find((c) => c.data.key === key)?.data.name ?? "—";
  const weekAgo = Date.now() - 7 * 24 * 60 * m;
  const week = changes.filter((c) => c.data.createdAt >= weekAgo);
  const byType = (Object.keys(typeLabels) as ChangeType[]).map((t) => `${typeLabels[t].toLowerCase()}: ${week.filter((c) => c.data.type === t).length}`).join(" · ");
  const visible = changes.filter((c) => filter === "all" || c.data.compKey === filter);

  return (
    <section className="demoApp">
      <div className="demoForm">
        <p className="demoFormTitle">Наблюдаемые конкуренты ({comps.length} из 7) — общий список</p>
        <div className="demoKinds">
          {comps.map((c) => <button key={c.id} type="button" className={activeKey === c.data.key ? "on" : ""} onClick={() => setCompKey(c.data.key)}>{c.data.name}</button>)}
        </div>
        <form className="demoAddComp" onSubmit={(event) => { event.preventDefault(); void addComp(); }}>
          <input value={newComp} onChange={(event) => setNewComp(event.target.value)} placeholder="Добавить конкурента — название" maxLength={60} />
          <button className="demoGhostBtn" type="submit">Добавить</button>
        </form>
        <hr className="demoSep" />
        <p className="demoFormTitle sub">Зафиксировать изменение</p>
        <div className="demoKinds">
          {(Object.keys(typeLabels) as ChangeType[]).map((t) => (
            <button key={t} type="button" className={type === t ? "on" : ""} onClick={() => setType(t)}>{typeLabels[t]}</button>
          ))}
        </div>
        <label>Что изменилось<textarea rows={3} value={text} onChange={(event) => setText(event.target.value)} placeholder="Факт и источник: что, где и как заметили" /></label>
        <button className="button demoBtn" type="button" onClick={() => void addChange()}>Внести в общую сводку <ArrowDownRight size={16} /></button>
        {loud ? <p className="formError">{loud}</p> : null}
        <p className="demoFootNote">Фиксируются публичные изменения: сайты, прайсы, анонсы. Сводка общая — записи всех наблюдателей складываются в одну картину недели.</p>
      </div>

      <div className="demoList">
        <div className="demoListHead">
          <p>Сводка за 7 дней — {byType} · обновление каждые 15 сек</p>
        </div>
        <div className="demoKinds demoFilter">
          <button type="button" className={filter === "all" ? "on" : ""} onClick={() => setFilter("all")}>Все</button>
          {comps.map((c) => <button key={c.id} type="button" className={filter === c.data.key ? "on" : ""} onClick={() => setFilter(c.data.key)}>{c.data.name}</button>)}
        </div>
        <WorkStateBox state={state} onRetry={() => void reload()} />
        {state === "ok" && (visible.length === 0
          ? <div className="demoEmpty">По этому конкуренту записей нет — тишина тоже данные: значит, неделю он держал курс.</div>
          : visible.map((change) => (
            <article className="demoCard" key={change.id}>
              <div className="demoCardTop">
                <span className="demoKind k-task">{compName(change.data.compKey)}</span>
                <span className={`demoStatus ${change.data.type === "price" ? "s-new" : change.data.type === "promo" ? "s-progress" : "s-done"}`}>{typeLabels[change.data.type].toUpperCase()}</span>
                <span className="demoTime">{dateLabel(change.data.createdAt)}</span>
                <button type="button" className="demoKill" onClick={() => void remove(change.id)} aria-label="Удалить запись"><Trash2 size={14} /></button>
              </div>
              <p className="demoNeed">{change.data.text}</p>
            </article>
          )))}
      </div>
    </section>
  );
}
