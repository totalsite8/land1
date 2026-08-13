"use client";

import { useState } from "react";
import { ArrowDownRight, Check, X } from "lucide-react";
import useBuckets from "./useBuckets";
import { SyncMark, WorkStateBox } from "./workUi";

type Tender = { id: string; title: string; type: string; budget: number; region: string; deadline: string };

const tenders: Tender[] = [
  { id: "t1", title: "Монтаж систем кондиционирования в БЦ «Аркада», 12 этажей", type: "Монтаж", budget: 2400000, region: "Москва и МО", deadline: "до 12.09" },
  { id: "t2", title: "Поставка офисной мебели для школы № 14", type: "Поставка", budget: 780000, region: "СПб", deadline: "до 28.08" },
  { id: "t3", title: "Проект электрики складского комплекса, 4000 м²", type: "Проект", budget: 950000, region: "Москва и МО", deadline: "до 03.09" },
  { id: "t4", title: "Сервисное обслуживание кофемашин сети из 22 точек", type: "Сервис", budget: 1200000, region: "Регионы", deadline: "до 20.08" },
  { id: "t5", title: "Монтаж видеонаблюдения в логистическом парке", type: "Монтаж", budget: 680000, region: "СПб", deadline: "до 15.09" },
  { id: "t6", title: "Поставка расходных материалов для типографии на год", type: "Поставка", budget: 340000, region: "Регионы", deadline: "до 25.08" },
  { id: "t7", title: "Проект вентиляции ресторана 260 м²", type: "Проект", budget: 1250000, region: "Москва и МО", deadline: "до 08.09" },
  { id: "t8", title: "Сервисная поддержка парка из 40 вендинговых аппаратов", type: "Сервис", budget: 540000, region: "Москва и МО", deadline: "до 30.08" }
];

const allTypes = ["Монтаж", "Поставка", "Проект", "Сервис"];
const allRegions = ["Москва и МО", "СПб", "Регионы"];

type Criteria = { types: string[]; regions: string[]; minBudget: number; marks: Record<string, "yes" | "no"> };
const defaults: Criteria = { types: ["Монтаж"], regions: ["Москва и МО"], minBudget: 500000, marks: {} };

const money = (n: number) => `${n.toLocaleString("ru-RU")} ₽`;

export default function TenderFitWork({ ws }: { ws: string }) {
  const { setMeta, metaItem, state, reload, pending, syncedAt } = useBuckets(ws);
  const [budgetDraft, setBudgetDraft] = useState<number | null>(null);
  const [loud, setLoud] = useState("");

  const meta = metaItem();
  const saved = (meta?.v as Partial<Criteria> | undefined) ?? {};
  const crit: Criteria = {
    types: Array.isArray(saved.types) ? saved.types : defaults.types,
    regions: Array.isArray(saved.regions) ? saved.regions : defaults.regions,
    minBudget: budgetDraft ?? (typeof saved.minBudget === "number" ? saved.minBudget : defaults.minBudget),
    marks: saved.marks ?? {}
  };

  async function save(next: Criteria) {
    const ok = await setMeta(next);
    if (!ok) setLoud("Не сохранилось — проверьте связь и попробуйте ещё раз.");
    else setLoud("");
  }

  function toggleList(list: string[], value: string) {
    return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
  }

  async function commitBudget() {
    if (budgetDraft === null) return;
    const v = Math.max(0, budgetDraft);
    setBudgetDraft(null);
    await save({ ...crit, minBudget: v });
  }

  const passFilter = (t: Tender) =>
    (crit.types.length === 0 || crit.types.includes(t.type)) &&
    t.budget >= crit.minBudget &&
    (crit.regions.length === 0 || crit.regions.includes(t.region));

  const matching = tenders.filter((t) => passFilter(t) && crit.marks[t.id] !== "no");
  const rejected = tenders.filter((t) => passFilter(t) && crit.marks[t.id] === "no").length;
  const outside = tenders.length - matching.length - rejected;

  return (
    <section className="demoApp">
      <div className="demoForm">
        <p className="demoFormTitle">Критерии «наше / не наше» — общие для команды</p>
        <div className="critSection">
          <p className="critLabel">ТИП РАБОТ</p>
          <div className="demoKinds">
            {allTypes.map((type) => (
              <button key={type} type="button" className={crit.types.includes(type) ? "on" : ""} onClick={() => void save({ ...crit, types: toggleList(crit.types, type) })}>{type}</button>
            ))}
          </div>
        </div>
        <div className="critSection">
          <p className="critLabel">РЕГИОН</p>
          <div className="demoKinds">
            {allRegions.map((region) => (
              <button key={region} type="button" className={crit.regions.includes(region) ? "on" : ""} onClick={() => void save({ ...crit, regions: toggleList(crit.regions, region) })}>{region}</button>
            ))}
          </div>
        </div>
        <div className="critSection">
          <p className="critLabel">МИНИМАЛЬНЫЙ БЮДЖЕТ, ₽</p>
          <input className="numField" type="number" min={0} step={50000} value={crit.minBudget}
            onChange={(event) => setBudgetDraft(Math.max(0, Number(event.target.value) || 0))}
            onBlur={() => void commitBudget()} />
        </div>
        {loud ? <p className="formError" role="alert">{loud}</p> : null}
        <p className="demoFootNote">Фильтр и отметки хранятся на сервере: отсеяв однажды, вы не увидите эти закупки ни с одного устройства команды. Лента закупок здесь учебная — на пилоте подключаем живой источник под ваш профиль.</p>
      </div>

      <div className="demoList">
        <div className="demoListHead">
          <p>Сегодня в ленте {tenders.length} закупок · прошли фильтр: {state === "ok" ? matching.length : "…"} · вне критериев: {state === "ok" ? outside : "…"}{rejected ? ` · отсеяно вами: ${rejected}` : ""} · <SyncMark ts={syncedAt} /></p>
          <button type="button" className="demoGhostBtn" onClick={() => void save({ ...defaults })} disabled={pending}>Сбросить фильтр</button>
        </div>
        <WorkStateBox state={state} onRetry={() => void reload()} />
        {state === "ok" && matching.length === 0 && <div className="demoEmpty">По этим критериям сегодня пусто. Ослабьте фильтр — или оставьте как есть: честный ноль лучше тридцати пустых строк.</div>}
        {state === "ok" && matching.map((t) => (
          <article className={`demoCard${crit.marks[t.id] === "yes" ? " picked" : ""}`} key={t.id}>
            <div className="demoCardTop">
              <span className="demoKind k-task">{t.type}</span>
              {crit.marks[t.id] === "yes" ? <span className="demoStatus s-done">НАШЕ</span> : null}
              <span className="demoTime">{t.deadline}</span>
            </div>
            <p className="demoNeed">{t.title}</p>
            <div className="demoMetaGrid">
              <span><b>БЮДЖЕТ</b>{money(t.budget)}</span>
              <span><b>РЕГИОН</b>{t.region}</span>
            </div>
            <div className="demoCardBtns">
              <button type="button" className="demoGhostBtn demoCardCta" onClick={() => void save({ ...crit, marks: { ...crit.marks, [t.id]: "yes" } })}><Check size={13} /> Наше</button>
              <button type="button" className="demoGhostBtn demoCardCta ghost" onClick={() => void save({ ...crit, marks: { ...crit.marks, [t.id]: "no" } })}><X size={13} /> Не наше — больше не показывать</button>
            </div>
          </article>
        ))}
        <details className="demoMore"><summary>Показать закупки вне фильтра ({outside}) <ArrowDownRight size={13} /></summary>
          <div className="demoOutList">{tenders.filter((t) => !passFilter(t)).map((t) => <p key={t.id}>{t.title} — {money(t.budget)}, {t.region}</p>)}</div>
        </details>
      </div>
    </section>
  );
}
