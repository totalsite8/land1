"use client";

import { useEffect, useState } from "react";
import { ArrowDownRight, Check, X } from "lucide-react";

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
const KEY = "demo-tenderfit";

const money = (n: number) => `${n.toLocaleString("ru-RU")} ₽`;

export default function TenderFitDemo() {
  const [types, setTypes] = useState<string[]>(["Монтаж"]);
  const [regions, setRegions] = useState<string[]>(["Москва и МО"]);
  const [minBudget, setMinBudget] = useState(500000);
  const [marks, setMarks] = useState<Record<string, "yes" | "no">>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { types?: string[]; regions?: string[]; minBudget?: number; marks?: Record<string, "yes" | "no"> };
        if (saved.types) setTypes(saved.types);
        if (saved.regions) setRegions(saved.regions);
        if (typeof saved.minBudget === "number") setMinBudget(saved.minBudget);
        if (saved.marks) setMarks(saved.marks);
      }
    } catch { /* повреждённое хранилище */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify({ types, regions, minBudget, marks })); } catch { /* приватный режим */ }
  }, [types, regions, minBudget, marks, ready]);

  function toggle(list: string[], value: string, set: (next: string[]) => void) {
    set(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  }

  const passFilter = (t: Tender) =>
    (types.length === 0 || types.includes(t.type)) &&
    t.budget >= minBudget &&
    (regions.length === 0 || regions.includes(t.region));

  const matching = tenders.filter((t) => passFilter(t) && marks[t.id] !== "no");
  const rejected = tenders.filter((t) => passFilter(t) && marks[t.id] === "no").length;
  const outside = tenders.length - matching.length - rejected;

  return (
    <section className="demoApp">
      <div className="demoForm">
        <p className="demoFormTitle">Ваши критерии «наше / не наше»</p>
        <div className="critSection">
          <p className="critLabel">ТИП РАБОТ</p>
          <div className="demoKinds">
            {allTypes.map((type) => (
              <button key={type} type="button" className={types.includes(type) ? "on" : ""} onClick={() => toggle(types, type, setTypes)}>{type}</button>
            ))}
          </div>
        </div>
        <div className="critSection">
          <p className="critLabel">РЕГИОН</p>
          <div className="demoKinds">
            {allRegions.map((region) => (
              <button key={region} type="button" className={regions.includes(region) ? "on" : ""} onClick={() => toggle(regions, region, setRegions)}>{region}</button>
            ))}
          </div>
        </div>
        <div className="critSection">
          <p className="critLabel">МИНИМАЛЬНЫЙ БЮДЖЕТ, ₽</p>
          <input className="numField" type="number" min={0} step={50000} value={minBudget} onChange={(event) => setMinBudget(Math.max(0, Number(event.target.value) || 0))} />
        </div>
        <p className="demoFootNote">Критерии сохраняются. Отметки «наше / не наше» точнят подбор следующих дней — фильтр запоминает, что вы отсеяли.</p>
      </div>

      <div className="demoList">
        <div className="demoListHead">
          <p>Сегодня в ленте {tenders.length} закупок · прошли фильтр: {matching.length} · вне критериев: {outside}{rejected ? ` · отсеяно вами: ${rejected}` : ""}</p>
          <button type="button" className="demoGhostBtn" onClick={() => { setMarks({}); setTypes(["Монтаж"]); setRegions(["Москва и МО"]); setMinBudget(500000); }}>Сбросить фильтр</button>
        </div>
        {matching.length === 0 && <div className="demoEmpty">По этим критериям сегодня пусто. Ослабьте фильтр — или оставьте как есть: честный ноль лучше тридцати пустых строк.</div>}
        {matching.map((t) => (
          <article className={`demoCard${marks[t.id] === "yes" ? " picked" : ""}`} key={t.id}>
            <div className="demoCardTop">
              <span className="demoKind k-task">{t.type}</span>
              {marks[t.id] === "yes" ? <span className="demoStatus s-done">НАШЕ</span> : null}
              <span className="demoTime">{t.deadline}</span>
            </div>
            <p className="demoNeed">{t.title}</p>
            <div className="demoMetaGrid">
              <span><b>БЮДЖЕТ</b>{money(t.budget)}</span>
              <span><b>РЕГИОН</b>{t.region}</span>
            </div>
            <div className="demoCardBtns">
              <button type="button" className="demoGhostBtn demoCardCta" onClick={() => setMarks((prev) => ({ ...prev, [t.id]: "yes" }))}><Check size={13} /> Наше</button>
              <button type="button" className="demoGhostBtn demoCardCta ghost" onClick={() => setMarks((prev) => ({ ...prev, [t.id]: "no" }))}><X size={13} /> Не наше — больше не показывать</button>
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
