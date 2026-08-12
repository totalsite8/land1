"use client";

import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Trash2 } from "lucide-react";

type Draft = { kind: string; label: string; text: string; statusIdx: number };
type Idea = { id: string; idea: string; drafts: Draft[]; createdAt: number };

const KEY = "demo-ideathread";
const m = 1000 * 60;
const statuses = ["Черновик", "На согласовании", "В очереди на публикацию"];

function buildDrafts(idea: string): Draft[] {
  return [
    { kind: "thesis", label: "Тезис", text: `«${idea}» — одна фраза и два аргумента в поддержку. Короткий формат для ленты.`, statusIdx: 0 },
    { kind: "review", label: "Разбор", text: `Разобрать наблюдение на примере из практики: что было, что сделали, чем это кончилось для клиента.`, statusIdx: 0 },
    { kind: "story", label: "История", text: `Развернуть в историю проекта: исходная ситуация, ход работы, итог с цифрой. Люди читают истории дольше тезисов.`, statusIdx: 0 }
  ];
}

const seed: Idea[] = [
  {
    id: "it-1",
    idea: "Гости спрашивают «что без глютена» чаще, чем мы меняем меню — стоп-лист должен быть на виду у зала",
    drafts: [
      { kind: "thesis", label: "Тезис", text: "Стоп-лист на виду экономит залу до 20 разъяснений в смену — и гость видит заботу до того, как спросил.", statusIdx: 2 },
      { kind: "review", label: "Разбор", text: "Разбор нашей недели: три вопроса про безглютеновое, одно разочарование и вывод про видимость списка в зале.", statusIdx: 1 },
      { kind: "story", label: "История", text: "История проекта: как кофейня у метро увела тему аллергий из кассовых разборов в отдельную табличку у входа.", statusIdx: 0 }
    ],
    createdAt: Date.now() - 2 * 24 * 60 * m
  }
];

export default function DraftsDemo() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [ready, setReady] = useState(false);
  const [idea, setIdea] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) { setIdeas(JSON.parse(raw) as Idea[]); setReady(true); return; }
    } catch { /* повреждённое хранилище */ }
    setIdeas(seed);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(ideas)); } catch { /* приватный режим */ }
  }, [ideas, ready]);

  function add() {
    const value = idea.trim();
    if (!value) return;
    setIdeas((list) => [{ id: `it-${Date.now()}`, idea: value, drafts: buildDrafts(value), createdAt: Date.now() }, ...list]);
    setIdea("");
  }

  function cycle(ideaId: string, draftIndex: number) {
    setIdeas((list) => list.map((item) => {
      if (item.id !== ideaId) return item;
      const drafts = item.drafts.map((draft, index) => index === draftIndex
        ? { ...draft, statusIdx: draft.statusIdx === statuses.length - 1 ? 0 : draft.statusIdx + 1 }
        : draft);
      return { ...item, drafts };
    }));
  }

  function statusClass(idx: number) {
    if (idx === statuses.length - 1) return "s-done";
    if (idx === 0) return "s-new";
    return "s-progress";
  }

  return (
    <section className="demoApp">
      <form className="demoForm" onSubmit={(event) => { event.preventDefault(); add(); }}>
        <p className="demoFormTitle">Одна мысль на входе</p>
        <label>Надиктуйте наблюдение*<textarea rows={3} value={idea} onChange={(event) => setIdea(event.target.value)} placeholder="Ответ на частый вопрос, вывод из проекта, рабочая находка" /></label>
        <button className="button demoBtn" type="submit">Разложить в цепочку <ArrowDownRight size={16} /></button>
        <p className="demoFootNote">Черновики — наброски под вашу мысль, а не «текст за автора»: финальную редакцию всегда делает человек. В пилоте это видно по статусам.</p>
      </form>

      <div className="demoList">
        <div className="demoListHead">
          <p>Мыслей в работе: {ideas.length}</p>
          {ideas.length > 0 && <button type="button" className="demoGhostBtn" onClick={() => setIdeas(seed)}>Сбросить к примеру</button>}
        </div>
        {!ready ? null : ideas.length === 0
          ? <div className="demoEmpty">Лента согласуется из головы — надиктуйте первую мысль слева.</div>
          : ideas.map((item) => (
            <article className="demoCard" key={item.id}>
              <div className="demoCardTop">
                <span className="demoKind k-task">Цепочка из 3 черновиков</span>
                <button type="button" className="demoKill" onClick={() => setIdeas((list) => list.filter((other) => other.id !== item.id))} aria-label="Удалить цепочку"><Trash2 size={14} /></button>
              </div>
              <p className="demoNeed">{item.idea}</p>
              <div className="demoDrafts">
                {item.drafts.map((draft, index) => (
                  <div className="demoDraft" key={draft.kind}>
                    <div className="demoDraftHead">
                      <b>{draft.label}</b>
                      <span className={`demoStatus ${statusClass(draft.statusIdx)}`}>{statuses[draft.statusIdx]}</span>
                    </div>
                    <p>{draft.text}</p>
                    <button type="button" className="demoGhostBtn demoDraftCta" onClick={() => cycle(item.id, index)}>
                      {draft.statusIdx === statuses.length - 1 ? "Вернуть в черновики" : `→ ${statuses[draft.statusIdx + 1]}`} <ArrowUpRight size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </article>
          ))}
      </div>
    </section>
  );
}
