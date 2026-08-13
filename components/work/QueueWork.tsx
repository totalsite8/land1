"use client";

import { useState } from "react";
import { ArrowDownRight, ArrowUpRight, Clock3 } from "lucide-react";
import type { QueueConfig } from "../demo/QueueDemo";
import useBuckets from "./useBuckets";
import { ConfirmKill, SyncMark, WorkStateBox } from "./workUi";

export type QueueRow = {
  kind?: string;
  values: Record<string, string>;
  statusIdx: number;
  createdAt: number;
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

/** Рабочая версия очереди: тот же конфиг, что у демо, но записи живут на сервере и общие для всех, у кого ссылка. */
export default function QueueWork({ config, ws }: { config: QueueConfig; ws: string }) {
  const { bucket, add, update, remove, state, reload, pending, syncedAt } = useBuckets(ws);
  const [values, setValues] = useState<Record<string, string>>({});
  const [kind, setKind] = useState<string | undefined>(config.defaultKind ?? config.kindTabs?.[0]?.id);
  const [loud, setLoud] = useState("");

  const items = bucket<QueueRow>("row");
  const lastIdx = config.statuses.length - 1;
  const open = items.filter((item) => item.data.statusIdx < lastIdx).length;

  function setField(id: string, value: string) { setValues((prev) => ({ ...prev, [id]: value })); }

  async function addRow() {
    for (const field of config.fields) {
      if (field.required && !(values[field.id] ?? "").trim()) return;
    }
    setLoud("");
    const clean = Object.fromEntries(config.fields.map((f) => [f.id, (values[f.id] ?? "").trim().slice(0, 900)]));
    const ok = await add("row", { kind: config.kindTabs ? kind : undefined, values: clean, statusIdx: 0, createdAt: Date.now() });
    if (ok) setValues({});
    else setLoud("Не сохранилось — проверьте связь и попробуйте ещё раз.");
  }

  function advance(item: { id: string; data: QueueRow }) {
    const statusIdx = item.data.statusIdx === lastIdx ? 0 : item.data.statusIdx + 1;
    void update(item.id, "row", { ...item.data, statusIdx });
  }

  function statusClass(idx: number) {
    if (idx === lastIdx) return "s-done";
    if (idx === 0) return "s-new";
    return "s-progress";
  }

  return (
    <section className="demoApp">
      <form className="demoForm" onSubmit={(event) => { event.preventDefault(); void addRow(); }}>
        <p className="demoFormTitle">{config.formTitle} — увидит вся команда</p>
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
        <button className="button demoBtn" type="submit" disabled={pending}>{pending ? "Сохраняю…" : <>{config.addLabel} <ArrowDownRight size={16} /></>}</button>
        {loud ? <p className="formError" role="alert">{loud}</p> : null}
        <p className="demoFootNote">Записи сохраняются на сервере и видны всем, у кого есть ссылка на это пространство. Доска обновляется сама каждые 15 секунд.</p>
      </form>

      <div className="demoList">
        <div className="demoListHead">
          <p>Общая доска — открыто {state === "ok" ? `${open} из ${items.length}` : "…"} · <SyncMark ts={syncedAt} /></p>
        </div>
        <WorkStateBox state={state} onRetry={() => void reload()} />
        {state === "ok" && (items.length === 0
          ? <div className="demoEmpty">Доска пуста — первая запись слева попадёт на неё одновременно ко всем, кто открыл ссылку.</div>
          : items.map((item) => {
            const closed = item.data.statusIdx === lastIdx;
            const kindLabel = config.kindTabs?.find((tab) => tab.id === item.data.kind)?.label;
            const overdue = !closed && config.overdueField && item.data.values[config.overdueField]
              && new Date(`${item.data.values[config.overdueField]}T23:59:59`) < new Date();
            return (
              <article className={`demoCard${closed ? " closed" : ""}`} key={item.id}>
                <div className="demoCardTop">
                  {kindLabel && <span className="demoKind k-task">{kindLabel}</span>}
                  <span className={`demoStatus ${statusClass(item.data.statusIdx)}`}>{config.statuses[item.data.statusIdx]}</span>
                  {overdue ? <span className="demoStatus s-new">ПРОСРОЧЕН</span> : null}
                  {config.showAge && !closed ? <span className="demoAge"><Clock3 size={11} /> ждёт {ageText(item.data.createdAt)}</span> : null}
                  <span className="demoTime">{timeLabel(item.data.createdAt)}</span>
                  <ConfirmKill onKill={() => void remove(item.id)} label="Удалить запись" disabled={pending} />
                </div>
                <p className="demoNeed">{item.data.values[config.titleField] || "—"}</p>
                <div className="demoMetaGrid">
                  {config.fields.filter((field) => field.id !== config.titleField).map((field) => (
                    <span key={field.id}><b>{field.label}</b>{field.kind === "date" ? dateLabel(item.data.values[field.id]) : (item.data.values[field.id] || "—")}</span>
                  ))}
                </div>
                <button type="button" className="demoGhostBtn demoCardCta" onClick={() => advance(item)}>
                  {closed ? (config.closedLabel ?? "Вернуть в открытые") : (config.verbs?.[item.data.statusIdx] ?? config.statuses[item.data.statusIdx + 1])} <ArrowUpRight size={13} />
                </button>
              </article>
            );
          }))}
      </div>
    </section>
  );
}
