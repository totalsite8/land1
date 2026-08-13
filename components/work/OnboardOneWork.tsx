"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDownRight, Check, RotateCcw } from "lucide-react";
import useWork from "./useWork";
import { SyncMark, WorkStateBox } from "./workUi";

type RoleStep = { text: string; done: boolean; custom?: boolean };
type RoleItem = { roleId: string; roleName: string; steps: RoleStep[] };

const defaultRoles: RoleItem[] = [
  {
    roleId: "waiter", roleName: "Официант",
    steps: [
      "Познакомьтесь с залом и планом посадки — обойдите его с меню в руках",
      "Выучите стоп-лист и замены на сегодня — спросите су-шефа",
      "Отработайте три вопроса гостям: аллергии, время ожидания, счёт",
      "Проведите смену парой с наставником — только наблюдаете",
      "Ведите два стола самостоятельно, наставник страхует",
      "Сдайте чек-контроль по стандартам сервиса"
    ].map((text) => ({ text, done: false }))
  },
  {
    roleId: "seller", roleName: "Продавец",
    steps: [
      "Изучите зоны магазина и где лежат ходовые позиции",
      "Разберите пять частых возражений и ответы на них",
      "Пробейте три тренировочные покупки на кассе",
      "Научитесь оформлять возврат и обмен без вызова старшего",
      "Отработайте день парой со старшим продавцом",
      "Сдайте тест по ассортименту — 20 вопросов"
    ].map((text) => ({ text, done: false }))
  },
  {
    roleId: "support", roleName: "Поддержка",
    steps: [
      "Прочитайте десять золотых диалогов прошлого месяца",
      "Выучите три статуса заявки и кто за каждый отвечает",
      "Ответьте на пять учебных обращений в песочнице",
      "Отвечайте реальным клиентам — наставник проверяет до отправки",
      "Проведите день самостоятельно, сложное эскалируйте",
      "Разбор ошибок со старшим и допуск к линии"
    ].map((text) => ({ text, done: false }))
  }
];

export default function OnboardOneWork({ ws }: { ws: string }) {
  const { items, state, create, patch, reload, pending, syncedAt } = useWork<RoleItem>(ws);
  const [roleId, setRoleId] = useState(defaultRoles[0].roleId);
  const [custom, setCustom] = useState("");
  const booted = useRef(false);

  // Первый заход в пустое пространство: раскладываем стартовые маршруты.
  useEffect(() => {
    if (state !== "ok" || items.length > 0 || booted.current) return;
    booted.current = true;
    void (async () => {
      for (const role of defaultRoles) await create(role);
    })();
  }, [state, items.length, create]);

  const role = items.find((item) => item.data.roleId === roleId);
  const steps = role?.data.steps ?? [];
  const doneCount = steps.filter((step) => step.done).length;
  const pct = steps.length ? Math.round((doneCount / steps.length) * 100) : 0;

  async function toggle(index: number) {
    if (!role) return;
    const nextSteps = role.data.steps.map((step, i) => (i === index ? { ...step, done: !step.done } : step));
    await patch(role.id, { ...role.data, steps: nextSteps });
  }

  async function addStep() {
    const text = custom.trim();
    if (!text || !role) return;
    await patch(role.id, { ...role.data, steps: [...role.data.steps, { text: text.slice(0, 220), done: false, custom: true }] });
    setCustom("");
  }

  async function reset() {
    const base = defaultRoles.find((r) => r.roleId === roleId);
    if (!role || !base) return;
    await patch(role.id, { ...role.data, steps: base.steps.map((step) => ({ ...step })) });
  }

  return (
    <section className="demoApp">
      <div className="demoForm">
        <p className="demoFormTitle">Маршрут новичка — общий для команды</p>
        <div className="demoRoles" role="tablist" aria-label="Выбор роли">
          {items.map((item) => (
            <button key={item.data.roleId} type="button" role="tab" aria-selected={item.data.roleId === roleId} className={item.data.roleId === roleId ? "on" : ""} onClick={() => setRoleId(item.data.roleId)}>{item.data.roleName}</button>
          ))}
        </div>
        <div className="demoProgress" aria-label={`Пройдено ${pct}%`}>
          <div className="demoProgressBar"><i style={{ width: `${pct}%` }} /></div>
          <span>{doneCount} из {steps.length} · {pct}%</span>
        </div>
        {pct === 100 && steps.length > 0 ? <p className="demoDone"><Check size={16} /> Маршрут пройден — новичок допущен к самостоятельной работе.</p> : null}
        <p className="demoFootNote">Прогресс хранится на сервере: наставник и новичок видят одну и ту же доску. Изменения доезжают до всех за ~15 секунд.</p>
      </div>

      <div className="demoList">
        <div className="demoListHead">
          <p>Шаги по роли — отмечает либо новичок, либо наставник · <SyncMark ts={syncedAt} /></p>
        </div>
        <WorkStateBox state={state} onRetry={() => void reload()} />
        {state === "ok" && !role ? <div className="demoEmpty">Готовим стартовые маршруты…</div> : null}
        {state === "ok" && role ? (
          <>
            <ol className="demoSteps">
              {steps.map((step, index) => (
                <li key={`${role.id}-${index}`} className={step.done ? "done" : ""}>
                  <button type="button" className="demoCheck" aria-pressed={step.done} aria-label={`Отметить шаг ${index + 1}`} onClick={() => void toggle(index)}>
                    {step.done ? <Check size={14} /> : null}
                  </button>
                  <div>
                    <b>{index + 1}.</b>
                    <p>{step.text}</p>
                    {step.custom ? <small>шаг команды</small> : null}
                  </div>
                </li>
              ))}
            </ol>
            <form className="demoAddStep" onSubmit={(event) => { event.preventDefault(); void addStep(); }}>
              <input value={custom} onChange={(event) => setCustom(event.target.value)} placeholder="Свой шаг маршрута — например, выучить адрес склада" maxLength={180} />
              <button className="button demoBtn" type="submit" disabled={pending}>{pending ? "Сохраняю…" : <>Добавить шаг для всех <ArrowDownRight size={16} /></>}</button>
            </form>
            <button type="button" className="demoGhostBtn demoReset" onClick={() => void reset()} disabled={pending}><RotateCcw size={13} /> Сбросить маршрут к базовому</button>
          </>
        ) : null}
      </div>
    </section>
  );
}
