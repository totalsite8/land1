"use client";

import { useState } from "react";
import { ArrowDownRight, Merge } from "lucide-react";
import useBuckets from "./useBuckets";
import { ConfirmKill, SyncMark, WorkStateBox } from "./workUi";

type LeadRow = {
  key: string;
  name: string;
  contact: string;
  source: string;
  dupKey: string | null;
  merged: number;
  createdAt: number;
};

const sources = ["Звонок", "Telegram", "WhatsApp", "Авито"];

/** Нормализация контакта в ключ сверки: телефон — по последним 10 цифрам, ник — в lowercase, всё остальное — по строке. */
function contactKey(contact: string) {
  const digits = contact.replace(/\D/g, "");
  if (digits.length >= 10) return `p:${digits.slice(-10)}`;
  const handle = contact.toLowerCase().replace(/^@/, "").trim();
  return `h:${handle}`;
}

function mergeKey(lead: { name: string; contact: string }) {
  return { contact: contactKey(lead.contact), name: lead.name.trim().toLowerCase() };
}

export default function DedupWork({ ws }: { ws: string }) {
  const { bucket, add, update, remove, state, reload, pending, syncedAt } = useBuckets(ws);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [source, setSource] = useState(sources[0]);
  const [loud, setLoud] = useState("");

  const leads = bucket<LeadRow>("lead");
  const byKey = (key: string) => leads.find((lead) => lead.data.key === key) ?? null;

  async function addLead() {
    const n = name.trim(); const c = contact.trim();
    if (!n || !c) return;
    setLoud("");
    const keys = mergeKey({ name: n, contact: c });
    const parent = leads.find((lead) => {
      const other = mergeKey(lead.data);
      return other.contact === keys.contact || (keys.name.length >= 4 && other.name.includes(keys.name));
    }) ?? null;
    const ok = await add("lead", {
      key: `ld-${Date.now()}`,
      name: n.slice(0, 120),
      contact: c.slice(0, 160),
      source,
      dupKey: parent ? (parent.data.dupKey ?? parent.data.key) : null,
      merged: 1,
      createdAt: Date.now()
    });
    if (ok) { setName(""); setContact(""); }
    else setLoud("Не сохранилось — проверьте связь и попробуйте ещё раз.");
  }

  async function merge(lead: { id: string; data: LeadRow }) {
    if (!lead.data.dupKey) return;
    const parent = byKey(lead.data.dupKey);
    await remove(lead.id);
    if (parent) await update(parent.id, "lead", { ...parent.data, merged: parent.data.merged + 1 });
  }

  const dups = leads.filter((lead) => lead.data.dupKey).length;

  return (
    <section className="demoApp">
      <form className="demoForm" onSubmit={(event) => { event.preventDefault(); void addLead(); }}>
        <p className="demoFormTitle">Новый лид — сверка при добавлении, общая база</p>
        <div className="demoKinds" role="tablist" aria-label="Источник">
          {sources.map((item) => (
            <button key={item} type="button" role="tab" aria-selected={source === item} className={source === item ? "on" : ""} onClick={() => setSource(item)}>{item}</button>
          ))}
        </div>
        <label>Имя / компания*<input value={name} onChange={(event) => setName(event.target.value)} placeholder="ООО «Север»" /></label>
        <label>Контакт*<input value={contact} onChange={(event) => setContact(event.target.value)} placeholder="+7 911 555-34-21 или @ник" /></label>
        <button className="button demoBtn" type="submit" disabled={pending}>{pending ? "Сохраняю…" : <>Добавить и сверить <ArrowDownRight size={16} /></>}</button>
        {loud ? <p className="formError" role="alert">{loud}</p> : null}
        <p className="demoFootNote">База общая: сверка идёт по последним 10 цифрам телефона, нику и похожему названию по всем лидам, что внесла вся команда. Дубль помечается до начала работы, а не после третьего звонка.</p>
      </form>

      <div className="demoList">
        <div className="demoListHead">
          <p>Лидов {state === "ok" ? leads.length : "…"} · помечено дублей: {state === "ok" ? dups : "…"} · <SyncMark ts={syncedAt} /></p>
        </div>
        <WorkStateBox state={state} onRetry={() => void reload()} />
        {state === "ok" && (leads.length === 0
          ? <div className="demoEmpty">Список пуст. Добавьте того же клиента дважды с разным форматом телефона — сверка найдёт совпадение.</div>
          : leads.map((lead) => {
            const parent = lead.data.dupKey ? byKey(lead.data.dupKey) : null;
            return (
              <article className={`demoCard${lead.data.dupKey ? " tRow alert" : ""}`} key={lead.id}>
                <div className="demoCardTop">
                  <span className="demoKind k-task">{lead.data.source}</span>
                  {lead.data.dupKey
                    ? <span className="demoStatus s-new">ПОХОЖЕ НА ДУБЛЬ{parent ? ` · совпал с «${parent.data.name}»` : ""}</span>
                    : <span className="demoStatus s-done">УНИКАЛЬНЫЙ{lead.data.merged > 1 ? ` · обращений: ${lead.data.merged}` : ""}</span>}
                  <ConfirmKill onKill={() => void remove(lead.id)} label="Удалить лид" disabled={pending} />
                </div>
                <p className="demoNeed">{lead.data.name}</p>
                <div className="demoMetaGrid">
                  <span><b>КОНТАКТ</b>{lead.data.contact}</span>
                  <span><b>ИСТОЧНИК</b>{lead.data.source}</span>
                </div>
                {lead.data.dupKey
                  ? <button type="button" className="demoGhostBtn demoCardCta" onClick={() => void merge(lead)} disabled={pending}><Merge size={13} /> Объединить в оригинал</button>
                  : null}
              </article>
            );
          }))}
      </div>
    </section>
  );
}
