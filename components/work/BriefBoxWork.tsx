"use client";

import { useState } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import useWork from "./useWork";
import { ConfirmKill, SyncMark, WorkStateBox } from "./workUi";

type BriefData = {
  need: string;
  deadline: string;
  context: string;
  contact: string;
  status: "new" | "progress" | "done";
};

const statusLabels: Record<BriefData["status"], string> = { new: "Новая", progress: "В работе", done: "Закрыта" };
const order: BriefData["status"][] = ["new", "progress", "done"];

export default function BriefBoxWork({ ws }: { ws: string }) {
  const { items, state, create, patch, remove, reload, pending, syncedAt } = useWork<BriefData>(ws);
  const [need, setNeed] = useState("");
  const [deadline, setDeadline] = useState("");
  const [context, setContext] = useState("");
  const [contact, setContact] = useState("");
  const [loud, setLoud] = useState("");

  async function add() {
    if (!need.trim() || !contact.trim()) return;
    setLoud("");
    const ok = await create({
      need: need.trim().slice(0, 900),
      deadline: deadline.trim().slice(0, 120) || "Срок не указан",
      context: context.trim().slice(0, 900) || "Контекст не записан",
      contact: contact.trim().slice(0, 160),
      status: "new"
    });
    if (ok) { setNeed(""); setDeadline(""); setContext(""); setContact(""); }
    else setLoud("Не сохранилось — проверьте связь и попробуйте ещё раз.");
  }

  async function cycle(id: string, current: BriefData) {
    const next = order[(order.indexOf(current.status) + 1) % order.length];
    await patch(id, { ...current, status: next });
  }

  const open = items.filter((item) => item.data.status !== "done").length;

  return (
    <section className="demoApp">
      <form className="demoForm" onSubmit={(event) => { event.preventDefault(); void add(); }}>
        <p className="demoFormTitle">Новая заявка — увидит вся команда</p>
        <label>Суть запроса*<textarea rows={3} value={need} onChange={(event) => setNeed(event.target.value)} placeholder="Что клиент хочет, без «уточню и вернусь»" /></label>
        <div className="demoGrid2">
          <label>Срок<input value={deadline} onChange={(event) => setDeadline(event.target.value)} placeholder="До пятницы 18:00" /></label>
          <label>Контакт*<input value={contact} onChange={(event) => setContact(event.target.value)} placeholder="@ник или телефон" /></label>
        </div>
        <label>Контекст из переписки<textarea rows={2} value={context} onChange={(event) => setContext(event.target.value)} placeholder="Фото, голосовое, предыстория" /></label>
        <button className="button demoBtn" type="submit" disabled={pending}>{pending ? "Сохраняю…" : <>На общую доску <ArrowDownRight size={16} /></>}</button>
        {loud ? <p className="formError" role="alert">{loud}</p> : null}
        <p className="demoFootNote">Заявка сохраняется на сервере и видна всем, у кого есть ссылка на это пространство. Доска обновляется сама каждые 15 секунд.</p>
      </form>

      <div className="demoList">
        <div className="demoListHead">
          <p>Общая доска — {items.length} заявок, {open} открыто · <SyncMark ts={syncedAt} /></p>
        </div>
        <WorkStateBox state={state} onRetry={() => void reload()} />
        {state === "ok" && items.length === 0 ? <div className="demoEmpty">Доска пуста — первая заявка слева попадёт на неё одновременно ко всем, кто открыл ссылку.</div> : null}
        {state === "ok" && items.map((item) => (
          <article className={`demoCard${item.data.status === "done" ? " closed" : ""}`} key={item.id}>
            <div className="demoCardTop">
              <span className={`demoStatus s-${item.data.status}`}>{statusLabels[item.data.status]}</span>
              <span className="demoTime">{new Date(item.createdAt).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}</span>
              <ConfirmKill onKill={() => void remove(item.id)} label="Удалить заявку" disabled={pending} />
            </div>
            <p className="demoNeed">{item.data.need}</p>
            <div className="demoMetaGrid">
              <span><b>Срок</b>{item.data.deadline}</span>
              <span><b>Контакт</b>{item.data.contact}</span>
              <span className="wide"><b>Контекст</b>{item.data.context}</span>
            </div>
            <button type="button" className="demoGhostBtn demoCardCta" onClick={() => void cycle(item.id, item.data)}>
              {item.data.status === "new" ? "Взять в работу" : item.data.status === "progress" ? "Отметить закрытой" : "Вернуть в работу"} <ArrowUpRight size={13} />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
