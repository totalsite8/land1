"use client";

import { useEffect, useState } from "react";
import { ArrowDownRight, Check, RotateCcw } from "lucide-react";

type Role = { id: string; name: string; steps: string[] };

const roles: Role[] = [
  {
    id: "waiter",
    name: "Официант",
    steps: [
      "Познакомьтесь с залом и планом посадки — обойдите его с меню в руках",
      "Выучите стоп-лист и замены на сегодня — спросите су-шефа",
      "Отработайте три вопроса гостям: аллергии, время ожидания, счёт",
      "Проведите смену парой с наставником — только наблюдаете",
      "Ведите два стола самостоятельно, наставник страхует",
      "Сдайте чек-контроль по стандартам сервиса"
    ]
  },
  {
    id: "seller",
    name: "Продавец",
    steps: [
      "Изучите зоны магазина и где лежат ходовые позиции",
      "Разберите пять частых возражений и ответы на них",
      "Пробейте три тренировочные покупки на кассе",
      "Научитесь оформлять возврат и обмен без вызова старшего",
      "Отработайте день парой со старшим продавцом",
      "Сдайте тест по ассортименту — 20 вопросов"
    ]
  },
  {
    id: "support",
    name: "Поддержка",
    steps: [
      "Прочитайте десять золотых диалогов прошлого месяца",
      "Выучите три статуса заявки и кто за каждый отвечает",
      "Ответьте на пять учебных обращений в песочнице",
      "Отвечайте реальным клиентам — наставник проверяет до отправки",
      "Проведите день самостоятельно, сложное эскалируйте",
      "Разбор ошибок со старшим и допуск к линии"
    ]
  }
];

const KEY = "demo-onboardone";

export default function OnboardOneDemo() {
  const [roleId, setRoleId] = useState(roles[0].id);
  const [done, setDone] = useState<Record<string, boolean[]>>({});
  const [stepTitle, setStepTitle] = useState("");
  const [extra, setExtra] = useState<Record<string, string[]>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { roleId?: string; done?: Record<string, boolean[]>; extra?: Record<string, string[]> };
        if (saved.roleId) setRoleId(saved.roleId);
        if (saved.done) setDone(saved.done);
        if (saved.extra) setExtra(saved.extra);
      }
    } catch { /* повреждённое хранилище — начинаем заново */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify({ roleId, done, extra })); } catch { /* приватный режим */ }
  }, [roleId, done, extra, ready]);

  const role = roles.find((item) => item.id === roleId) ?? roles[0];
  const baseSteps = role.steps;
  const extraSteps = extra[roleId] ?? [];
  const allSteps = [...baseSteps, ...extraSteps];
  const marks = done[roleId] ?? [];
  const doneCount = allSteps.filter((_, index) => marks[index]).length;
  const pct = allSteps.length ? Math.round((doneCount / allSteps.length) * 100) : 0;

  function toggle(index: number) {
    setDone((prev) => {
      const list = [...(prev[roleId] ?? [])];
      list[index] = !list[index];
      return { ...prev, [roleId]: list };
    });
  }

  function addStep() {
    const name = stepTitle.trim();
    if (!name) return;
    setExtra((prev) => ({ ...prev, [roleId]: [...(prev[roleId] ?? []), name] }));
    setStepTitle("");
  }

  function reset() {
    setDone((prev) => ({ ...prev, [roleId]: [] }));
    setExtra((prev) => ({ ...prev, [roleId]: [] }));
  }

  return (
    <section className="demoApp">
      <div className="demoForm">
        <p className="demoFormTitle">Маршрут новичка по роли</p>
        <div className="demoRoles" role="tablist" aria-label="Выбор роли">
          {roles.map((item) => (
            <button key={item.id} type="button" role="tab" aria-selected={item.id === roleId} className={item.id === roleId ? "on" : ""} onClick={() => setRoleId(item.id)}>{item.name}</button>
          ))}
        </div>
        <div className="demoProgress" aria-label={`Пройдено ${pct}%`}>
          <div className="demoProgressBar"><i style={{ width: `${pct}%` }} /></div>
          <span>{doneCount} из {allSteps.length} · {pct}%</span>
        </div>
        {pct === 100 && <p className="demoDone"><Check size={16} /> Маршрут пройден — новичок допущен к самостоятельной работе.</p>}
        <p className="demoFootNote">Отмечайте шаги справа — прогресс сохраняется в браузере. Добавьте свой шаг, если в вашей роли он обязателен.</p>
      </div>

      <div className="demoList">
        <ol className="demoSteps">
          {allSteps.map((step, index) => (
            <li key={`${roleId}-${index}`} className={marks[index] ? "done" : ""}>
              <button type="button" className="demoCheck" aria-pressed={Boolean(marks[index])} aria-label={`Отметить шаг ${index + 1}`} onClick={() => toggle(index)}>
                {marks[index] ? <Check size={14} /> : null}
              </button>
              <div>
                <b>{index + 1}.</b>
                <p>{step}</p>
                {index >= baseSteps.length && <small>ваш шаг</small>}
              </div>
            </li>
          ))}
        </ol>
        <form className="demoAddStep" onSubmit={(event) => { event.preventDefault(); addStep(); }}>
          <input value={stepTitle} onChange={(event) => setStepTitle(event.target.value)} placeholder="Свой шаг маршрута — например, выучить адрес склада" maxLength={180} />
          <button className="button demoBtn" type="submit">Добавить шаг <ArrowDownRight size={16} /></button>
        </form>
        <button type="button" className="demoGhostBtn demoReset" onClick={reset}><RotateCcw size={13} /> Сбросить маршрут роли</button>
      </div>
    </section>
  );
}
