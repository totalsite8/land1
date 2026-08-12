"use client";

import { useEffect, useState } from "react";
import { ArrowDownRight, Merge, Trash2 } from "lucide-react";

type Lead = {
  id: string;
  name: string;
  contact: string;
  source: string;
  dupOf: string | null;
  merged: number;
  createdAt: number;
};

const KEY = "demo-leaddedup";
const sources = ["Звонок", "Telegram", "WhatsApp", "Авито"];
const m = 1000 * 60;

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

const seed: Lead[] = [
  { id: "ld-1", name: "ООО «Север»", contact: "+7 (911) 555-34-21", source: "Звонок", dupOf: null, merged: 1, createdAt: Date.now() - 2 * 24 * 60 * m },
  { id: "ld-2", name: "ИП Морозова", contact: "@morozova_ip", source: "Telegram", dupOf: null, merged: 1, createdAt: Date.now() - 26 * 60 * m },
  { id: "ld-3", name: "«Север», снабжение", contact: "8 911 555 34 21", source: "Авито", dupOf: "ld-1", merged: 1, createdAt: Date.now() - 5 * 60 * m }
];

export default function DedupDemo() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [ready, setReady] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [source, setSource] = useState(sources[0]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) { setLeads(JSON.parse(raw) as Lead[]); setReady(true); return; }
    } catch { /* повреждённое хранилище */ }
    setLeads(seed);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(leads)); } catch { /* приватный режим */ }
  }, [leads, ready]);

  function add() {
    const n = name.trim(); const c = contact.trim();
    if (!n || !c) return;
    const keys = mergeKey({ name: n, contact: c });
    const parent = leads.find((lead) => {
      const other = mergeKey(lead);
      return other.contact === keys.contact || (keys.name.length >= 4 && other.name.includes(keys.name));
    }) ?? null;
    const item: Lead = {
      id: `ld-${Date.now()}`,
      name: n, contact: c, source,
      dupOf: parent ? parent.id : null,
      merged: 1,
      createdAt: Date.now()
    };
    if (parent) {
      setLeads((list) => [{ ...item, dupOf: parent.dupOf ?? parent.id }, ...list]);
    } else {
      setLeads((list) => [item, ...list]);
    }
    setName(""); setContact("");
  }

  function merge(item: Lead) {
    if (!item.dupOf) return;
    setLeads((list) => list.filter((lead) => lead.id !== item.id)
      .map((lead) => lead.id === item.dupOf ? { ...lead, merged: lead.merged + 1 } : lead));
  }

  const dups = leads.filter((lead) => lead.dupOf).length;

  return (
    <section className="demoApp">
      <form className="demoForm" onSubmit={(event) => { event.preventDefault(); add(); }}>
        <p className="demoFormTitle">Новый лид — сверка при добавлении</p>
        <div className="demoKinds" role="tablist" aria-label="Источник">
          {sources.map((item) => (
            <button key={item} type="button" role="tab" aria-selected={source === item} className={source === item ? "on" : ""} onClick={() => setSource(item)}>{item}</button>
          ))}
        </div>
        <label>Имя / компания*<input value={name} onChange={(event) => setName(event.target.value)} placeholder="ООО «Север»" /></label>
        <label>Контакт*<input value={contact} onChange={(event) => setContact(event.target.value)} placeholder="+7 911 555-34-21 или @ник" /></label>
        <button className="button demoBtn" type="submit">Добавить и сверить <ArrowDownRight size={16} /></button>
        <p className="demoFootNote">Сверка идёт по последним 10 цифрам телефона, нику и похожему названию — формат записи значения не имеет. Дубль помечается до начала работы, а не после третьего звонка.</p>
      </form>

      <div className="demoList">
        <div className="demoListHead">
          <p>Лидов {leads.length} · помечено дублей: {dups}</p>
          {leads.length > 0 && <button type="button" className="demoGhostBtn" onClick={() => setLeads(seed)}>Сбросить к примеру</button>}
        </div>
        {!ready ? null : leads.length === 0
          ? <div className="demoEmpty">Список пуст. Добавьте того же клиента дважды с разным форматом телефона — сверка найдёт совпадение.</div>
          : leads.map((lead) => {
            const parent = lead.dupOf ? leads.find((other) => other.id === lead.dupOf) ?? null : null;
            return (
              <article className={`demoCard${lead.dupOf ? " tRow alert" : ""}`} key={lead.id}>
                <div className="demoCardTop">
                  <span className="demoKind k-task">{lead.source}</span>
                  {lead.dupOf
                    ? <span className="demoStatus s-new">ПОХОЖЕ НА ДУБЛЬ{parent ? ` · совпал с «${parent.name}»` : ""}</span>
                    : <span className="demoStatus s-done">УНИКАЛЬНЫЙ{lead.merged > 1 ? ` · обращений: ${lead.merged}` : ""}</span>}
                  <button type="button" className="demoKill" onClick={() => setLeads((list) => list.filter((other) => other.id !== lead.id))} aria-label="Удалить лид"><Trash2 size={14} /></button>
                </div>
                <p className="demoNeed">{lead.name}</p>
                <div className="demoMetaGrid">
                  <span><b>КОНТАКТ</b>{lead.contact}</span>
                  <span><b>ИСТОЧНИК</b>{lead.source}</span>
                </div>
                {lead.dupOf
                  ? <button type="button" className="demoGhostBtn demoCardCta" onClick={() => merge(lead)}><Merge size={13} /> Объединить в оригинал</button>
                  : null}
              </article>
            );
          })}
      </div>
    </section>
  );
}
