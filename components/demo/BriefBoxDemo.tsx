"use client";

import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Trash2 } from "lucide-react";

type Brief = {
  id: string;
  need: string;
  deadline: string;
  context: string;
  contact: string;
  status: "new" | "progress" | "done";
  createdAt: number;
};

const KEY = "demo-briefbox";
const statusLabels: Record<Brief["status"], string> = { new: "Новая", progress: "В работе", done: "Закрыта" };

const seed: Brief[] = [
  {
    id: "seed-1",
    need: "Клиент спросил цену на оклейку пленкой Toyota Camry и попросил швы в цвет",
    deadline: "Ответить сегодня до 18:00",
    context: "Прислал фото машины в чат, голосовое 0:47 с деталями по цвету",
    contact: "@driver_amigo (Telegram)",
    status: "progress",
    createdAt: Date.now() - 1000 * 60 * 47
  },
  {
    id: "seed-2",
    need: "Хочет вывеску 3×1 м для кофейни на Ленина, световые буквы",
    deadline: "Просит расчёт до пятницы",
    context: "Пришёл по рекомендации, есть фасад с прошлой вывеской",
    contact: "+7 900 555-23-45 (WhatsApp)",
    status: "new",
    createdAt: Date.now() - 1000 * 60 * 12
  }
];

export default function BriefBoxDemo() {
  const [items, setItems] = useState<Brief[]>([]);
  const [ready, setReady] = useState(false);
  const [need, setNeed] = useState("");
  const [deadline, setDeadline] = useState("");
  const [context, setContext] = useState("");
  const [contact, setContact] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) { setItems(JSON.parse(raw) as Brief[]); setReady(true); return; }
    } catch { /* повреждённое хранилище — идём с сидами */ }
    setItems(seed);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* приватный режим */ }
  }, [items, ready]);

  function addBrief() {
    if (!need.trim() || !contact.trim()) return;
    setItems((list) => [{
      id: `b-${Date.now()}`,
      need: need.trim(),
      deadline: deadline.trim() || "Срок не указан",
      context: context.trim() || "Контекст не записан",
      contact: contact.trim(),
      status: "new",
      createdAt: Date.now()
    }, ...list]);
    setNeed(""); setDeadline(""); setContext(""); setContact("");
  }

  function cycle(id: string) {
    const order: Brief["status"][] = ["new", "progress", "done"];
    setItems((list) => list.map((item) => item.id === id ? { ...item, status: order[(order.indexOf(item.status) + 1) % 3] } : item));
  }

  function remove(id: string) { setItems((list) => list.filter((item) => item.id !== id)); }

  const open = items.filter((item) => item.status !== "done").length;

  return (
    <section className="demoApp">
      <form className="demoForm" onSubmit={(event) => { event.preventDefault(); addBrief(); }}>
        <p className="demoFormTitle">Соберите заявку одной карточкой</p>
        <label>Суть запроса*<textarea rows={3} value={need} onChange={(event) => setNeed(event.target.value)} placeholder="Что клиент хочет, без «уточню и вернусь»" /></label>
        <div className="demoGrid2">
          <label>Срок<input value={deadline} onChange={(event) => setDeadline(event.target.value)} placeholder="До пятницы 18:00" /></label>
          <label>Контакт*<input value={contact} onChange={(event) => setContact(event.target.value)} placeholder="@ник или телефон" /></label>
        </div>
        <label>Контекст из переписки<textarea rows={2} value={context} onChange={(event) => setContext(event.target.value)} placeholder="Фото, голосовое, предыстория — что уже сказано" /></label>
        <button className="button demoBtn" type="submit">Собрать заявку <ArrowDownRight size={16} /></button>
        <p className="demoFootNote">Поля со * обязательны — без них карточка не собирается, как и в рабочем инструменте.</p>
      </form>

      <div className="demoList">
        <div className="demoListHead">
          <p>Все заявки видны целиком — {items.length} шт., {open} открыто</p>
          {items.length > 0 && <button type="button" className="demoGhostBtn" onClick={() => setItems(seed)}>Сбросить к примеру</button>}
        </div>
        {items.length === 0 && <div className="demoEmpty">Список пуст — соберите первую заявку слева. Обычно на такую сборку уходит 30 секунд вместо 10 минут поиска по перепискам.</div>}
        {items.map((item) => (
          <article className="demoCard" key={item.id} data-status={item.status}>
            <div className="demoCardTop">
              <span className={`demoStatus s-${item.status}`}>{statusLabels[item.status]}</span>
              <button type="button" className="demoKill" onClick={() => remove(item.id)} aria-label="Удалить заявку"><Trash2 size={14} /></button>
            </div>
            <p className="demoNeed">{item.need}</p>
            <div className="demoMetaGrid">
              <span><b>Срок</b>{item.deadline}</span>
              <span><b>Контакт</b>{item.contact}</span>
              <span className="wide"><b>Контекст</b>{item.context}</span>
            </div>
            <button type="button" className="demoGhostBtn demoCardCta" onClick={() => cycle(item.id)}>
              {item.status === "new" ? "Взять в работу" : item.status === "progress" ? "Отметить закрытой" : "Вернуть в работу"} <ArrowUpRight size={13} />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
