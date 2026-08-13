"use client";

import { useState } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import useBuckets from "./useBuckets";
import { ConfirmKill, SyncMark, WorkStateBox } from "./workUi";

type Draft = { kind: string; label: string; text: string; statusIdx: number };
type IdeaRow = { idea: string; drafts: Draft[]; createdAt: number };

const statuses = ["Черновик", "На согласовании", "В очереди на публикацию"];

function buildDrafts(idea: string): Draft[] {
  return [
    { kind: "thesis", label: "Тезис", text: `«${idea}» — одна фраза и два аргумента в поддержку. Короткий формат для ленты.`, statusIdx: 0 },
    { kind: "review", label: "Разбор", text: "Разобрать наблюдение на примере из практики: что было, что сделали, чем это кончилось для клиента.", statusIdx: 0 },
    { kind: "story", label: "История", text: "Развернуть в историю проекта: исходная ситуация, ход работы, итог с цифрой. Люди читают истории дольше тезисов.", statusIdx: 0 }
  ];
}

export default function DraftsWork({ ws }: { ws: string }) {
  const { bucket, add, update, remove, state, reload, pending, syncedAt } = useBuckets(ws);
  const [idea, setIdea] = useState("");
  const [loud, setLoud] = useState("");

  const ideas = bucket<IdeaRow>("idea");

  async function addIdea() {
    const value = idea.trim();
    if (!value) return;
    setLoud("");
    const ok = await add("idea", { idea: value.slice(0, 900), drafts: buildDrafts(value.trim().slice(0, 300)), createdAt: Date.now() });
    if (ok) setIdea("");
    else setLoud("Не сохранилось — проверьте связь и попробуйте ещё раз.");
  }

  function cycle(item: { id: string; data: IdeaRow }, draftIndex: number) {
    const drafts = item.data.drafts.map((draft, index) => index === draftIndex
      ? { ...draft, statusIdx: draft.statusIdx === statuses.length - 1 ? 0 : draft.statusIdx + 1 }
      : draft);
    void update(item.id, "idea", { ...item.data, drafts });
  }

  function statusClass(idx: number) {
    if (idx === statuses.length - 1) return "s-done";
    if (idx === 0) return "s-new";
    return "s-progress";
  }

  return (
    <section className="demoApp">
      <form className="demoForm" onSubmit={(event) => { event.preventDefault(); void addIdea(); }}>
        <p className="demoFormTitle">Одна мысль на входе — общая редакция</p>
        <label>Надиктуйте наблюдение*<textarea rows={3} value={idea} onChange={(event) => setIdea(event.target.value)} placeholder="Ответ на частый вопрос, вывод из проекта, рабочая находка" /></label>
        <button className="button demoBtn" type="submit" disabled={pending}>{pending ? "Сохраняю…" : <>Разложить в цепочку <ArrowDownRight size={16} /></>}</button>
        {loud ? <p className="formError" role="alert">{loud}</p> : null}
        <p className="demoFootNote">Черновики — наброски под вашу мысль, а не «текст за автора»: финальную редакцию всегда делает человек. Цепочка общая: статусы двигает любой из команды, все видят одно состояние.</p>
      </form>

      <div className="demoList">
        <div className="demoListHead">
          <p>Мыслей в работе: {state === "ok" ? ideas.length : "…"} · <SyncMark ts={syncedAt} /></p>
        </div>
        <WorkStateBox state={state} onRetry={() => void reload()} />
        {state === "ok" && (ideas.length === 0
          ? <div className="demoEmpty">Лента согласуется из головы — надиктуйте первую мысль слева.</div>
          : ideas.map((item) => (
            <article className="demoCard" key={item.id}>
              <div className="demoCardTop">
                <span className="demoKind k-task">Цепочка из 3 черновиков</span>
                <ConfirmKill onKill={() => void remove(item.id)} label="Удалить цепочку" disabled={pending} />
              </div>
              <p className="demoNeed">{item.data.idea}</p>
              <div className="demoDrafts">
                {item.data.drafts.map((draft, index) => (
                  <div className="demoDraft" key={draft.kind}>
                    <div className="demoDraftHead">
                      <b>{draft.label}</b>
                      <span className={`demoStatus ${statusClass(draft.statusIdx)}`}>{statuses[draft.statusIdx]}</span>
                    </div>
                    <p>{draft.text}</p>
                    <button type="button" className="demoGhostBtn demoDraftCta" onClick={() => cycle(item, index)}>
                      {draft.statusIdx === statuses.length - 1 ? "Вернуть в черновики" : `→ ${statuses[draft.statusIdx + 1]}`} <ArrowUpRight size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </article>
          )))}
      </div>
    </section>
  );
}
