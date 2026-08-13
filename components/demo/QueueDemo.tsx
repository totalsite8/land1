"use client";

import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Clock3 } from "lucide-react";
import { ConfirmKill } from "../work/workUi";

export type QueueField = {
  id: string;
  label: string;
  placeholder?: string;
  kind?: "text" | "date";
  textarea?: boolean;
  required?: boolean;
};

export type QueueItem = {
  id: string;
  kind?: string;
  values: Record<string, string>;
  statusIdx: number;
  createdAt: number;
};

export type QueueConfig = {
  storage: string;
  formTitle: string;
  kindTabs?: { id: string; label: string }[];
  defaultKind?: string;
  fields: QueueField[];
  titleField: string;
  addLabel: string;
  note: string;
  emptyText: string;
  statuses: string[];
  verbs?: string[];
  closedLabel?: string;
  showAge?: boolean;
  overdueField?: string;
  seed: QueueItem[];
};

function ageText(ts: number) {
  const mins = Math.max(1, Math.floor((Date.now() - ts) / 60000));
  if (mins < 60) return `${mins} мин`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `${h} ч ${mins % 60} мин`;
  const d = Math.floor(h / 24);
  return `${d} дн ${h % 24} ч`;
}

function timeLabel(ts: number) {
  return new Date(ts).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

function dateLabel(value: string) {
  if (!value) return "—";
  const d = new Date(`${value}T12:00:00`);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString("ru-RU");
}

export default function QueueDemo({ config }: { config: QueueConfig }) {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [ready, setReady] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [kind, setKind] = useState<string | undefined>(config.defaultKind ?? config.kindTabs?.[0]?.id);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(config.storage);
      if (raw) { setItems(JSON.parse(raw) as QueueItem[]); setReady(true); return; }
    } catch { /* повреждённое хранилище — идём с примера */ }
    setItems(config.seed);
    setReady(true);
  }, [config]);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(config.storage, JSON.stringify(items)); } catch { /* приватный режим */ }
  }, [items, ready, config.storage]);

  const lastIdx = config.statuses.length - 1;
  const open = items.filter((item) => item.statusIdx < lastIdx).length;

  function setField(id: string, value: string) { setValues((prev) => ({ ...prev, [id]: value })); }

  function add() {
    for (const field of config.fields) {
      if (field.required && !(values[field.id] ?? "").trim()) return;
    }
    const clean = Object.fromEntries(config.fields.map((f) => [f.id, (values[f.id] ?? "").trim()]));
    setItems((list) => [{
      id: `q-${Date.now()}`,
      kind: config.kindTabs ? kind : undefined,
      values: clean,
      statusIdx: 0,
      createdAt: Date.now()
    }, ...list]);
    setValues({});
  }

  function advance(id: string) {
    setItems((list) => list.map((item) => item.id === id
      ? { ...item, statusIdx: item.statusIdx === lastIdx ? 0 : item.statusIdx + 1 }
      : item));
  }

  function remove(id: string) { setItems((list) => list.filter((item) => item.id !== id)); }

  function statusClass(idx: number) {
    if (idx === lastIdx) return "s-done";
    if (idx === 0) return "s-new";
    return "s-progress";
  }

  return (
    <section className="demoApp">
      <form className="demoForm" onSubmit={(event) => { event.preventDefault(); add(); }}>
        <p className="demoFormTitle">{config.formTitle}</p>
        {config.kindTabs && (
          <div className="demoKinds" role="tablist" aria-label="Тип записи">
            {config.kindTabs.map((tab) => (
              <button key={tab.id} type="button" role="tab" aria-selected={kind === tab.id} className={kind === tab.id ? "on" : ""} onClick={() => setKind(tab.id)}>{tab.label}</button>
            ))}
          </div>
        )}
        {config.fields.map((field) => (
          <label key={field.id}>{field.label}{field.required ? "*" : ""}
            {field.textarea
              ? <textarea rows={field.id === config.titleField ? 3 : 2} value={values[field.id] ?? ""} onChange={(event) => setField(field.id, event.target.value)} placeholder={field.placeholder} />
              : <input type={field.kind === "date" ? "date" : "text"} value={values[field.id] ?? ""} onChange={(event) => setField(field.id, event.target.value)} placeholder={field.placeholder} />}
          </label>
        ))}
        <button className="button demoBtn" type="submit">{config.addLabel} <ArrowDownRight size={16} /></button>
        <p className="demoFootNote">{config.note}</p>
      </form>

      <div className="demoList">
        <div className="demoListHead">
          <p>Открыто {open} из {items.length}</p>
          {items.length > 0 && <button type="button" className="demoGhostBtn" onClick={() => setItems(config.seed)}>Сбросить к примеру</button>}
        </div>
        {!ready ? null : items.length === 0
          ? <div className="demoEmpty">{config.emptyText}</div>
          : items.map((item) => {
            const closed = item.statusIdx === lastIdx;
            const kindLabel = config.kindTabs?.find((tab) => tab.id === item.kind)?.label;
            const overdue = !closed && config.overdueField && item.values[config.overdueField]
              && new Date(`${item.values[config.overdueField]}T23:59:59`) < new Date();
            return (
              <article className={`demoCard${closed ? " closed" : ""}`} key={item.id}>
                <div className="demoCardTop">
                  {kindLabel && <span className="demoKind k-task">{kindLabel}</span>}
                  <span className={`demoStatus ${statusClass(item.statusIdx)}`}>{config.statuses[item.statusIdx]}</span>
                  {overdue ? <span className="demoStatus s-new">ПРОСРОЧЕН</span> : null}
                  {config.showAge && !closed ? <span className="demoAge"><Clock3 size={11} /> ждёт {ageText(item.createdAt)}</span> : null}
                  <span className="demoTime">{timeLabel(item.createdAt)}</span>
                  <ConfirmKill onKill={() => remove(item.id)} label="Удалить запись" />
                </div>
                <p className="demoNeed">{item.values[config.titleField] || "—"}</p>
                <div className="demoMetaGrid">
                  {config.fields.filter((field) => field.id !== config.titleField).map((field) => (
                    <span key={field.id}><b>{field.label}</b>{field.kind === "date" ? dateLabel(item.values[field.id]) : (item.values[field.id] || "—")}</span>
                  ))}
                </div>
                <button type="button" className="demoGhostBtn demoCardCta" onClick={() => advance(item.id)}>
                  {closed ? (config.closedLabel ?? "Вернуть в открытые") : (config.verbs?.[item.statusIdx] ?? config.statuses[item.statusIdx + 1])} <ArrowUpRight size={13} />
                </button>
              </article>
            );
          })}
      </div>
    </section>
  );
}
